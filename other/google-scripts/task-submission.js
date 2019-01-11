// GET https://apiurl?key=zns-test

var API_KEY = "zns-test";
var TASK_SPREADSHEET_ID = "1FFNOBq7LXesjj_hnnQAp6JtmnX6NIVpZcU1kkQ13AzA";
var MEGASHEET_ID = "1sGBfKDG61EQmIzW11Wfm51kzMcdH8F1HluENkfrFNBI";

function doGet(e)
{
    if(!isAuthorized(e))
    {
        return buildErrorResponse("unauthorized");
    }

    //TODO: return something if no incomplete tasks
    task = getIncompleteTask();

    if(task === null)
    {
        return buildErrorResponse("no new tasks");
    }
  
    //TODO: error handle if device not found
    deviceInfo = getOldDeviceInfo(task["task"]["device"] + task["task"]["newDeviceID"]);
  
    edits = suggestedEdits(deviceInfo,task);
    var response = {
        task: {
            member: task.task.volunteerName,
            row: task.row,
        },
        current: {
            row: deviceInfo.row,
            id: deviceInfo.info.deviceID,
            code: deviceInfo.info.Code,
            user: deviceInfo.info.User,
            notes: deviceInfo.info.Notes,
            description: deviceInfo.info.Description,
            value: deviceInfo.info.price,
        },
        updated: edits
    };
    return buildSuccessResponse(response);
}

function doPost(e)
{
    if(!isAuthorized(e))
    {
        return buildErrorResponse("unauthorized");
    }

    if(String(e.parameter.accepted).toLowerCase() === "true")
    {
        updateMainSheet(e.parameter);
    }
    updateTaskSheet(e.parameter);

    return buildSuccessResponse("updated spreadsheet");
}

function updateMainSheet(parameter)
{
    var spreadsheet = SpreadsheetApp.openById(MEGASHEET_ID);
    var worksheet = spreadsheet.getSheetByName("Inventory");
    
    //TODO: validate user entries before entering
    if(parameter.deviceID === worksheet.getRange(parameter.deviceRow, 2).getValue()) // verify that id is the same
    {
        var columnKey = {code: 3, notes: 6, description: 7, value: 17};
        Object.keys(columnKey).forEach(function(key) { // update each entry in columnnKey
            worksheet.getRange(parameter.deviceRow, columnKey[key]).setValue(parameter[key]);
        });
    }
}

function updateTaskSheet(parameter)
{
    var spreadsheet = SpreadsheetApp.openById(TASK_SPREADSHEET_ID);
    var worksheet = spreadsheet.getSheetByName("ZNS");

    var status = String(parameter.accepted).toLowerCase() === "true" ? "TRUE" : "DENY";
    Logger.log(status);
    worksheet.getRange(parameter.taskRow, 1).setValue(status);
}

function getIncompleteTask()
{
    var spreadsheet = SpreadsheetApp.openById(TASK_SPREADSHEET_ID);
    var worksheet = spreadsheet.getSheetByName("ZNS");
    var rows = worksheet.getDataRange().getValues();

    var headings = rows[0];
    var entries = rows.slice(1);
    var entriesWithHeadings = addHeadings(entries, headings);
    for(var i = 0; i < entriesWithHeadings.length; i++)
    {
        if(entriesWithHeadings[i]["isComplete"] === false || entriesWithHeadings[i]["isComplete"] === "FALSE")
        {
            return {"task": entriesWithHeadings[i], "row": i+2};
        }
    }
    return null;
}

function getOldDeviceInfo(deviceNumber)
{
    var spreadsheet = SpreadsheetApp.openById(MEGASHEET_ID);
    var worksheet = spreadsheet.getSheetByName("Inventory");
    var rows = worksheet.getDataRange().getValues();
    var headings = rows[0];
    var entries = rows.slice(1);
    var entriesWithHeadings = addHeadings(entries, headings);
    for(var i = 0; i < entriesWithHeadings.length; i++)
    {
        if(entriesWithHeadings[i]["deviceID"].toLowerCase() === deviceNumber.toLowerCase())
        {
            return {"info": entriesWithHeadings[i], "row": i+2};
        }
    }
}

function suggestedEdits(deviceInfo, taskInfo)
{
    var newInfo = {};
    if(parseInt(taskInfo["task"]["status"]) !== deviceInfo.info.Code)
    {
        newInfo["code"] = parseInt(taskInfo["task"]["status"]);
    }
    else
    {
        newInfo["code"] = deviceInfo.info.Code;
    }
    
    if(taskInfo["task"]["notes"] !== "" || taskInfo["task"]["newNotes"] !== "")
    {
        var today = new Date();
        var today = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear().toString().substr(-2);
        var newText = deviceInfo["info"]["Notes"] === "" 
            ? deviceInfo["info"]["Notes"]
            : deviceInfo["info"]["Notes"] + "\n";
        newText += today + ": " + taskInfo["task"]["notes"] + taskInfo["task"]["newNotes"];
        newInfo["notes"] = newText;
    }
    else
    {
        newInfo["notes"] = deviceInfo.info.Notes;
    }

    if(taskInfo["task"]["description"] !== "")
    {
        var newText = deviceInfo["info"]["Description"] === "" 
            ? taskInfo["task"]["description"]
            : deviceInfo["info"]["Description"] + "\n" + taskInfo["task"]["description"];
        newInfo["description"] = newText;
    }
    else
    {
        newInfo["description"] = deviceInfo.info.Description;
    }

    if(taskInfo["task"]["price"] !== "")
    {
        newInfo["value"] = taskInfo["task"]["price"];
    }
    else
    {
        newInfo["value"] = deviceInfo.info.price;
    }

    return newInfo
}

function addHeadings(entries, headings)
{
    return entries.map(function(entryAsArray) {
        var entryAsObj = {};
        headings.forEach(function(heading, i) {
            entryAsObj[heading] = entryAsArray[i];
        });
        return entryAsObj;
    });
}

// function removeCompleted(entries, completed)
// {
//     return entries.filter(function(entry) {
//         return entry["isComplete"] !== true && entry["isComplete"] !== "";
//     });
// }

function isAuthorized(e)
{
    return "key" in e.parameters && e.parameters["key"][0] == API_KEY;
}

function buildSuccessResponse(data)
{
    var output = JSON.stringify(data);
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}

function buildErrorResponse(message)
{
    var output = JSON.stringify({
        status: "error",
        message: message
    });

    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
}

// function getRequestParam(e)
// {
//     return "request" in e.parameters 
//         ? e.parameters["request"][0]
//         : "review";
// }