const data = {
    host: "www.example.com",
    key: "ce560d17b50341ff9b02fecaa3ee72fd",
    urlList: [
        "https://www.example.com/url1",
        "https://www.example.com/folder/url2",
        "https://www.example.com/url3"
    ]
};

fetch('https://searchengine/indexnow', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
