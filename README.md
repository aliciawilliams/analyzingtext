# Analyzing Text Data with Google Sheets and Cloud Natural Language

This is the code from my NEXT 2018 talk of the same title.

In the demo, I use Google Forms, [Cloud Natural Language](https://cloud.google.com/natural-language/), Google Sheets, and Apps Script to analyze vacation rental reviews. I use Cloud Natural Languages's [Entity Sentiment Analysis](https://cloud.google.com/natural-language/docs/analyzing-entity-sentiment) method, which combines both entity analysis and sentiment analysis and attempts to determine the sentiment (positive or negative) expressed about entities within the text.

I will add in the talk video as soon as it is available on YouTube.

# Setup

## Form and Spreadsheet Setup
1. Create a Google Form modeled after this template: [Post-stay review form template](https://docs.google.com/forms/d/1PHOGOQQ9oxMH1I6WLFj9CAi5zzTfw93EkLtYUvNGpIg/edit).

2. Choose to collect form responses in a spreasheet following the instructions in [this support article](https://support.google.com/docs/answer/2917686?hl=en&ref_topic=6063592).

3. Access the response spreadsheet and add two additional tabs. Name these tabs "Review Data" and "Entity Sentiment Data", and add headers in row 1 exactly as in this template: [Post-stay reviews spreadsheet template](https://docs.google.com/spreadsheets/d/1P7HXXJMY97GHFVufApphrUnvpGEE1QIkEXLSKhbnywc/edit?usp=sharing).

## Apps Script Setup
1. From your response spreadsheet, access the Script Editor from the Tools menu.
2. Create three script files [preprocess.gs](https://github.com/aliciawilliams/analyzingtext/blob/master/preprocess.gs), [nlcall.gs](https://github.com/aliciawilliams/analyzingtext/blob/master/nlcall.gs), and [apikey.gs](https://github.com/aliciawilliams/analyzingtext/blob/master/apikey.gs).
3. Click Save.

## Google Cloud Platform Project Setup
1. The API call to Cloud Natural Language (in nlcall.gs) requires a Google Cloud Platform account and project. You can sign up for the Free Trial of Google Cloud Platform at [https://cloud.google.com/free/](https://cloud.google.com/free/).
2. Once you have a project, [enable the Google Natural Language API](https://support.google.com/cloud/answer/6158841) and [create an API key](https://cloud.google.com/docs/authentication/api-keys?hl=en&ref_topic=6262490&visit_id=1-636679045733721544-2073460348&rd=1).
3. Copy the API key into [apikey.gs](https://github.com/aliciawilliams/analyzingtext/blob/master/apikey.gs), replacing YOUR_KEY_HERE but maintaining the quotes.

## Add Apps Script Trigger
1. From the Edit menu within the Script Editor, choose Current Project Triggers.
2. Choose to run "onFormSubmit", "From spreadsheet", "On form submit". Set notifications to immediately (for any debugging; you may change this later).

# Try it out!
Now's your chance to try it out! 

1. Open the Google Form and submit a response (you may submit your own text, or use the reviews from the [Boston Airbnb Open Data](https://www.kaggle.com/airbnb/boston) on Kaggle.
2. Check to see the response populates on both the "Form Responses" tab and the "Review Data" tab.
3. Confirm that columns F and G of the "Review Data" tab have populated with the formula to detect the text language and translate non-English text into English (these are part of preprocess.gs).
4. Finally, from the 'Demo Tools' menu in the responses sheet, select 'Mark Entities and Sentiment'. This will kick off the markEntitySentiment function from nlcall.gs. You should see column H in the "Review Data" tab start to populate each row as "complete", while the API response data received back from Cloud Natural Lanaguage (entities and their sentiment) are flowing into the "Entity Sentiment Data" tab.

Bonus: Once you have processed your data, you may consider visualizing it using [Data Studio](https://datastudio.google.com/). You can view [my Data Studio report](https://datastudio.google.com/open/1b8nKdCkbUY7yM40A49RlwQmJJtXt1JvI) if you like.

# Appendix
For more detailed information on a similar demo, check out my blog post ["Analyzing text in a Google Sheet using Cloud Natural Language API and Apps Script"](https://cloud.google.com/blog/big-data/2017/12/analyzing-text-in-a-google-sheet-using-cloud-natural-language-api-and-apps-script)

Let me know if you run into any problems!

NOTE: This is not an official Google product.


