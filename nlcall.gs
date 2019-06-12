// Copyright 2015, Google, Inc. 
// Licensed under the Apache License, Version 2.0 (the "License"); 
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at 
//  
//    http://www.apache.org/licenses/LICENSE-2.0 
//  
// Unless required by applicable law or agreed to in writing, software 
// distributed under the License is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
// See the License for the specific language governing permissions and 
// limitations under the License.

/**
 * Performs entity sentiment analysis on english text data in a sheet using Cloud Natural Language (cloud.google.com/natural-language/).
 */

var COLUMN_NAME = {
  COMMENTS: 'comments',
  LANGUAGE: 'language_detected',
  TRANSLATION: 'comments_english',
  ENTITY: 'entity_sentiment',
  ID: 'reviewer_name',
  TIMESTAMP: 'timestamp',
  PROPERTY_ID: 'property_id',
  STAY_DATE: 'stay_date'
};

/**
 * Creates a Demo Tools menu in Google Spreadsheets.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Demo Tools')
    .addItem('Mark entities and sentiment', 'markEntitySentiment')
    .addToUi();
};
  

/**
* For each row in the 'Review Data' sheet with a value in "comments" field, 
* will run the retrieveEntitySentiment function
* and copy results into the 'Entity Sentiment Data' sheet.
*/

function markEntitySentiment() {
  // set variables for 'Review Data' sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName('Review Data');
  var rows = dataSheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var headerRow = values[0];
  
  // checks to see if 'Entity Sentiment Data' sheet is present; if not, creates new sheet and sets header row
  var entitySheet = ss.getSheetByName('Entity Sentiment Data');
  if (entitySheet == null) {
   ss.insertSheet('Entity Sentiment Data');
   var entitySheet = ss.getSheetByName('Entity Sentiment Data');
   var esHeaderRange = entitySheet.getRange(1,1,1,9);
   var esHeader = [['Timestamp','Reviewer Name','Stay Date','Property ID','Entity','Salience','Sentiment Score','Sentiment Magnitude','Number of mentions']];
   esHeaderRange.setValues(esHeader);
  };
  
  // find the column index for comments, language_detected, comments_english
  var commentsColumnIdx = headerRow.indexOf(COLUMN_NAME.COMMENTS);
  var languageColumnIdx = headerRow.indexOf(COLUMN_NAME.LANGUAGE);
  var translationColumnIdx = headerRow.indexOf(COLUMN_NAME.TRANSLATION);
  var entityColumnIdx = headerRow.indexOf(COLUMN_NAME.ENTITY);
  var idColumnIdx = headerRow.indexOf(COLUMN_NAME.ID);
  var timestampColumnIdx = headerRow.indexOf(COLUMN_NAME.TIMESTAMP);
  var propertyIdColumnIdx = headerRow.indexOf(COLUMN_NAME.PROPERTY_ID);
  var dateColumnIdx = headerRow.indexOf(COLUMN_NAME.STAY_DATE);
  if (entityColumnIdx == -1) {
    Browser.msgBox("Error: Could not find the column named " + COLUMN_NAME.ENTITY + ". Please create and empty column with header \"entity_sentiment\" on the Review Data tab.");
    return; // bail
  };
    
  ss.toast("Analyzing entities and sentiment...");
   // Process each row 
  for (var i = 0; i < numRows; ++i) {
    var value = values[i];
    var commentEnCellVal = value[translationColumnIdx];
    var entityCellVal = value[entityColumnIdx];
    var reviewId = value[idColumnIdx];
    var timestamp = value[timestampColumnIdx];
    var propertyId = value[propertyIdColumnIdx];
    var stayDate = value[dateColumnIdx];
    // Call retrieveEntitySentiment function for each row that has comments and also an empty entity_sentiment cell
    if(commentEnCellVal && !entityCellVal) {
        var nlData = retrieveEntitySentiment(commentEnCellVal);
        // Paste each entity and sentiment score into 'Entity Sentiment Data' sheet
        var newValues = []
        for each (var entity in nlData.entities) {  
          var row = [timestamp, reviewId, stayDate, propertyId, entity.name, entity.salience, entity.sentiment.score, entity.sentiment.magnitude, entity.mentions.length
                    ];
          newValues.push(row);
        }
          if(newValues.length) {
          entitySheet.getRange(entitySheet.getLastRow() + 1, 1, newValues.length, newValues[0].length).setValues(newValues);
        }
        // Paste "complete" into entity_sentiment column to denote completion of NL API call
        dataSheet.getRange(i+1, entityColumnIdx+1).setValue("complete");
     }
   }
};

/**
 * Calls the NL API with a string
 * @param {String} line The line of string
 * @return {Object} the entities and related sentiment present in the string.
 */

function retrieveEntitySentiment (line) {
  var apiKey = myApiKey;
  var apiEndpoint = 'https://language.googleapis.com/v1/documents:analyzeEntitySentiment?key=' + apiKey;
  // Create our json request, w/ text, language, type & encoding
  var nlData = {
    document: {
      language: 'en-us',
      type: 'PLAIN_TEXT',
      content: line
    },
    encodingType: 'UTF8'
  };
  //  Package all of the options and the data together for the call
  var nlOptions = {
    method : 'post',
    contentType: 'application/json',  
    payload : JSON.stringify(nlData)
  };
  //  And make the call
  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);
  return JSON.parse(response);
};
