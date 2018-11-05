//	Copyright 2015, Google, Inc. 
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
//

/**
 * Performs preprocessing on form response data to prepare it for analysis with Cloud Natural Language (see nlcall.gs)
 * Copies form responses into a new sheet called 'Review Data'
 * Adds new columns to detect language and translate the comments field into English
 */

function onFormSubmit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("Review Data");
  var pasteRow = dataSheet.getLastRow() + 1;
  var entitySheet = ss.getSheetByName("Entity Sentiment Data");
  
  //copy form responses into 'Review Data' sheet
  var response = [e.values];
  var responseRange = dataSheet.getRange(pasteRow,1,1,e.values.length);
  responseRange.setValues(response);
  
  //paste formula for language_detected
  var languageDetectRange = dataSheet.getRange(pasteRow,e.values.length + 1,1,1);
  var languageDetectFormula = '=IFERROR(DETECTLANGUAGE(R[0]C[-1]))';
  languageDetectRange.setFormulaR1C1(languageDetectFormula);
  
  //paste formula for comments_english
  var commentsEnglishRange = dataSheet.getRange(pasteRow,e.values.length + 2,1,1);
  var commentsEnglishFormula = '=IF(and(R[0]C[-1]<>"en", R[0]C[-1]<>""),GOOGLETRANSLATE(R[0]C[-2],R[0]C[-1],"en"),R[0]C[-2])';
  commentsEnglishRange.setFormulaR1C1(commentsEnglishFormula);
};
