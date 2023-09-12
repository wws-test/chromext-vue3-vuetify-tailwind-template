    chrome.devtools.network.getHAR(function(result) {
      try {
        if (result && result.entries) {
          for (var i = 0; i < result.entries.length; i++) {
            var entry = result.entries[i];
            var response = entry.response;
            if (response && response.content.mimeType === 'application/json') {
              if (response.content.text) {
                try {
                  var responseData = JSON.parse(response.content.text);
                  if (responseData.code == 0) {
                    // 调用chrome的通知API展示全部的response
                    showNotification(response.content.text);
                  }
                } catch (error) {
                  console.error('Invalid JSON:', error);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
    
    function showNotification(text) {
      chrome.notifications.create({
        type: 'basic',
        title: 'Response Code',
        message: text,
        iconUrl: 'icon.png'
      });
    }