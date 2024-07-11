$(document).ready(function() {
    var hexagramString = $('#hexagram-string').text();
    var hexagramArray = hexagramString.split("");

    // Respective image to append for lines 6, 7, 8 and 9
    var yinChanging = '<img src="./images/yin_changing.svg" class="line-image" alt="changing yin line">';
    var yang = '<img src="./images/yang.svg" class="line-image" alt="stable yang line">';
    var yin = '<img src="./images/yin.svg" class="line-image" alt="stable yin line">';
    var yangChanging = '<img src="./images/yang_changing.svg" class="line-image" alt="changing yang line">';

    // String containing the HTML code to append to display the hexagram graphics
    var html = '';

    // Loop through array containing value of lines in order and add to string `html`
    for (let i = 0; i <= hexagramArray.length; i++) {
        let line = i + 1;
        // Select what to append to `html` according to the value of each line in the hexagram
        switch(hexagramArray[i]) {
            case '6':
                html += '<div class="value-' + line + ' line-label yao-' + hexagramArray[i] + '"></div><div class="image-' + line + '">' + yinChanging + '</div>';
                break;
            case '7':
                html += '<div class="value-' + line + ' line-label yao-' + hexagramArray[i] + '"></div><div class="image-' + line + '">' + yang + '</div>';
                break;
            case '8':
                html += '<div class="value-' + line + ' line-label yao-' + hexagramArray[i] + '"></div><div class="image-' + line + '">' + yin + '</div>';
                break;
            case '9':
                html += '<div class="value-' + line + ' line-label yao-' + hexagramArray[i] + '"></div><div class="image-' + line + '">' + yangChanging + '</div>';
                break;
        }
    }

    // Append the string `html` which contains all the code to render the hexagram graphics
    $('#hexagram-diagram').append(html);

    // Select all the links loaded on the on the page tagged with `.api`
    var reference = document.querySelectorAll('.api');
    console.log(reference);

    Array.prototype.forEach.call(reference, (link, index) => {
        // Get the URL in the `href` attribute
        let url = link.getAttribute('href');
        console.log('API URL: ');
        console.log(url);

        // Get the array position of the cited text from the `id` attribute in the JSON object returned from the API call
        let id = link.getAttribute('id');
        let arrayPosition
        id.split('-').length == 3 ? arrayPosition = id.split('-')[2] : arrayPosition = id.split('-')[1];

        console.log('Position in array');
        console.log(arrayPosition);

        // Determine which book the cited text is from the attribute `id`
        let whichBook = id.split("-")[0];
        console.log('Source of text:');
        console.log(whichBook);

        // Determine which part of the Book of Changes the cited text is from from the attribute `id`
        let whichPart = id.split("-")[1];
        console.log('Which part of the Book of Changes:');
        console.log(whichPart);

        // String that will contain the name of the part of the Book of Changes that will be displayed in HTML
        let citation;

        //  AJAX request to call the API for the relevant text entries to display
        $.ajax({
            url: url,
            type: 'GET',
            success: function(json) {
                let retrieved = json.fulltext[arrayPosition];
                console.log(retrieved);

                if (whichBook == 'yijing') {
                    if (whichPart == 'classic') {
                        citation = "《周易》：";
                    } else if (whichPart == 'image') {
                        citation = "《周易·象傳》：";
                    } else if (whichPart == 'judgment') {
                        citation = "《周易·彖傳》：";
                    }
                } else if (whichBook == 'yilin') {
                    citation = "《焦氏易林》：";
                }
                console.log(citation);

                $('#retrieved-text').append('<h4 class="is-size-6">' + citation +'</h4>')
                $('#retrieved-text').append('<p class=" is-size-4">' + retrieved + '</p');
            },
            error: function() {
                console.log("An error occured…");
                console.log('`xhr.status`: ');
                console.log(xhr.status);
                console.log('`xhr.statusText`');
                console.log(xhr.statusText);
            }
        })
    });
});
