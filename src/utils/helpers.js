export function capitalizeFirstLetterOfEachWord(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }


  export function cleanBookTitle(str) {
    // Step 1: Keep everything before the first appearance of ":"
    // Find the first appearance of ":" or "("
    const colonIndex = str.indexOf(":");
    const parenIndex = str.indexOf("/");

    // Determine the earliest appearance, if either is found
    const cutoffIndex = (colonIndex !== -1 && parenIndex !== -1) 
        ? Math.min(colonIndex, parenIndex) 
        : (colonIndex !== -1 ? colonIndex : parenIndex);

    // If there's a cutoff point, truncate the string at that index
    if (cutoffIndex !== -1) {
        str = str.substring(0, cutoffIndex);
    }

    // Step 2: Truncate to 70 characters and add "..." if necessary
    str = str.length > 70 ? str.substring(0, 70) + "..." : str;

    // Step 3: Trim ws
    return str.trim();

    
}



export function typeText(container, text, waitFor, delay = 150) {
  container.text("");

  text.split("").forEach((char, index) => {
    setTimeout(() => {
      container.text(container.text() + char);
    }, waitFor + index * delay);
  });
};
