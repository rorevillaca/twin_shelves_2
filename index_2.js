document.addEventListener("DOMContentLoaded", function() {
    const allBookcasesData = [
        // Bookcase 1
        [
            [{width: 40}, {width: 30}, {width: 50}, {width: 45}, {width: 60}],
            [{width: 35}, {width: 60}, {width: 40}],
            [{width: 50}, {width: 55}, {width: 45}, {width: 35}],
            [{width: 60}, {width: 30}, {width: 40}],
            [{width: 45}, {width: 55}, {width: 50}],
            [{width: 30}, {width: 40}, {width: 50}, {width: 35}, {width: 60}]
        ],
        // Bookcase 2
        [
            [{width: 50}, {width: 45}, {width: 55}, {width: 60}, {width: 35}],
            [{width: 40}, {width: 30}, {width: 50}],
            [{width: 60}, {width: 40}, {width: 45}, {width: 35}],
            [{width: 30}, {width: 35}, {width: 60}],
            [{width: 50}, {width: 55}, {width: 40}],
            [{width: 55}, {width: 45}, {width: 30}, {width: 60}, {width: 35}]
        ],
        // Bookcase 3
        [
            [{width: 30}, {width: 40}, {width: 60}, {width: 45}, {width: 35}],
            [{width: 55}, {width: 50}, {width: 45}],
            [{width: 60}, {width: 35}, {width: 55}, {width: 40}],
            [{width: 50}, {width: 30}, {width: 45}],
            [{width: 35}, {width: 55}, {width: 40}],
            [{width: 60}, {width: 50}, {width: 45}, {width: 35}, {width: 30}]
        ],
        // Bookcase 4
        [
            [{width: 40}, {width: 35}, {width: 55}, {width: 50}, {width: 45}],
            [{width: 30}, {width: 50}, {width: 40}],
            [{width: 55}, {width: 60}, {width: 45}, {width: 35}],
            [{width: 50}, {width: 45}, {width: 35}],
            [{width: 40}, {width: 55}, {width: 50}],
            [{width: 60}, {width: 35}, {width: 30}, {width: 50}, {width: 45}]
        ],
        // Bookcase 5
        [
            [{width: 30}, {width: 55}, {width: 50}, {width: 60}, {width: 40}],
            [{width: 45}, {width: 35}, {width: 50}],
            [{width: 40}, {width: 45}, {width: 55}, {width: 35}],
            [{width: 50}, {width: 55}, {width: 40}],
            [{width: 35}, {width: 50}, {width: 60}],
            [{width: 55}, {width: 45}, {width: 30}, {width: 40}, {width: 50}]
        ]
    ];

    let startIndex = 0;
    const bookcaseWidth = window.innerWidth / 3 - 40;
    const shelfHeight = 60;

    function renderBookcases(startIndex) {
        const bookcasesData = allBookcasesData.slice(startIndex, startIndex + 3);

        d3.select("#bookcases").selectAll(".bookcase").remove();

        const bookcases = d3.select("#bookcases")
            .selectAll(".bookcase")
            .data(bookcasesData)
            .enter()
            .append("div")
            .attr("class", "bookcase")
            .style("width", bookcaseWidth + "px");

        const shelves = bookcases.selectAll(".shelf")
            .data(d => d)
            .enter()
            .append("div")
            .attr("class", "shelf")
            .style("height", shelfHeight + "px");

        shelves.selectAll(".book")
            .data(d => d)
            .enter()
            .append("div")
            .attr("class", "book")
            .style("width", d => d.width + "px");
    }

    renderBookcases(startIndex);

    d3.select("#left-arrow").on("click", function() {
        if (startIndex > 0) {
            startIndex -= 1;
            renderBookcases(startIndex);
        }
    });

    d3.select("#right-arrow").on("click", function() {
        if (startIndex < allBookcasesData.length - 3) {
            startIndex += 1;
            renderBookcases(startIndex);
        }
    });
});
