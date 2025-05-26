from flask import Flask, Response
from smartcard.scard import *
from smartcard.pcsc import *
import smartcard.util
from flask_cors import CORS
from book_db import BookDB
import os
import time

app = Flask(__name__)
CORS(app)


def event_stream():
        """Continously checks if there is a stage change for the reader. 
        This event stream is a generator that out puts the serial IDs when they arrive. 
        Checking for state changes is blocking.
        """
        
        try:
            print('----- Trying to establish context with reader: --')

            hresult, hcontext = SCardEstablishContext(SCARD_SCOPE_USER)
            if hresult != SCARD_S_SUCCESS:
                raise error(
                    'Failed to establish context: ' +
                    SCardGetErrorMessage(hresult))
            
            print('----- Context established! ----------------------')

            try:
                hresult, readers = SCardListReaders(hcontext, [])
                if hresult != SCARD_S_SUCCESS:
                    raise error(
                        'Failed to list readers: ' +
                        SCardGetErrorMessage(hresult))
                
                print('----- Found Readers! ------------------------')

                print('PCSC Readers:', readers)

                readerstates = []
                for i in range(len(readers)):
                    readerstates += [(readers[i], SCARD_STATE_UNAWARE)]


                while True:

                    print('----- Current reader and card states are: -------')
                    hresult, newstates = SCardGetStatusChange(hcontext, 0, readerstates)
                    for i in newstates:
                        print(i)


                    
                    print('----- Please insert or remove a card ------------')
                    hresult, newstates = SCardGetStatusChange(
                                            hcontext,
                                            INFINITE,
                                            newstates)

                    print('----- New reader and card states are: -----------')
                    for i in newstates:
                        print(i)

                        _x, eventstate, _y = i

                        if eventstate & SCARD_STATE_PRESENT:
                            hresult, hcard, dwActiveProtocol = SCardConnect(
                                        hcontext,
                                        readers[0],
                                        SCARD_SHARE_SHARED,
                                        SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1)
                            hresult, response_ID = SCardTransmit(hcard,dwActiveProtocol,[0xFF,0xCA,0x00,0x00,0x00])

                            print('----- FOUND ID ------------------------------')
                            
                            print(smartcard.util.toHexString(response_ID[:-2], smartcard.util.HEX))
                            # yield 'data: %s\n\n' % (smartcard.util.toHexString(response[:-2], smartcard.util.HEX))

                            hresult, hcard, dwActiveProtocol = SCardConnect(
                                        hcontext,
                                        readers[0],
                                        SCARD_SHARE_SHARED,
                                        SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1)
                            hresult, response_DATA = SCardTransmit(hcard,dwActiveProtocol,[0xFF,0xB0,0x00,0x03,0x00])
                            if hresult != SCARD_S_SUCCESS:
                                raise PCSCExceptions.BaseSCardException(hresult)
                            print('----- FOUND DATA ------------------------------')

                            if response_DATA == [105,130]:
                                print("RESET CARD... restarting...")
                                os.system("sutdown /r /t 15")

                            smartcard_content = smartcard.util.toHexString(response_DATA[:-2], smartcard.util.HEX)
                            try:
                                book_barcode = db.transform_hex_to_barcode(smartcard_content)
                                book_oclc = db.get_book_oclc(book_barcode)
                                print(f"Barcode: {book_barcode}, OCLC: {book_oclc}")
                                yield f'data: {book_oclc}\n\n'
                            except:
                                print("No matching barcode found in DB")

            except error as e:
                print(e)

            finally:
                hresult = SCardReleaseContext(hcontext)
                if hresult != SCARD_S_SUCCESS:
                    raise error(
                        'Failed to release context: ' +
                        SCardGetErrorMessage(hresult))
                print('Released context.')

        except error as e:
            print(e)

@app.route('/stream')
def stream():
    """Entry point for a new stream"""
    print('----- New Stream Connection: --------------------')

    return Response(event_stream(),
                          mimetype="text/event-stream")

@app.route('/')
def home():
    """"Quick Demo showcase usage of the stream using JavaScript"""
    return """
        <!doctype html>
        <pre id="out"></pre>
        <script>
            function sse() {
                var source = new EventSource('/stream');
                var out = document.getElementById('out');
                source.onmessage = function(e) {
                    // XSS in chat is fun (let's prevent that)
                    out.textContent =  e.data + '\\n' + out.textContent;
                };
            }
            sse();
        </script>

    """ 


if __name__ == '__main__':
    db = BookDB()
    app.debug = True
    app.run(host='127.0.0.1', port=8080, threaded=True, debug=True)


