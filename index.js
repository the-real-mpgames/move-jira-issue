const core = require('@actions/core');
const github = require('@actions/github');
const request = require('request-promise-native');
const matchAll = require("match-all");
const unique = require('array-unique');

try {
    const jiraEmail = process.env['JIRA_EMAIL'];
    const jiraToken = process.env['JIRA_API_TOKEN'];
    const jiraUrl = process.env['JIRA_URL']
    const action = core.getInput('jira-action');
    switch (action) {
        case 'move_issue_when_pull_request_closed':
            moveIssueWhenPullRequestClose(jiraEmail, jiraToken, jiraUrl);
            break;
    }
} catch (error) {
    core.setFailed(error.message);
}

function moveIssueWhenPullRequestClose(jiraEmail, jiraToken, jiraUrl) {
    const transitionId = process.env['JIRA_TRANSITION_ID'];
    const buildNumber = process.env['GITHUB_RUN_NUMBER'];
    const body = github.context.payload.pull_request.body
    const title = github.context.payload.pull_request.title
    const littlestring = ' ';
    const bigstring = title + littlestring + body;
    const start = async () => {
        const listOfIds = unique( matchAll(bigstring,  /(LH\-[0-9]{1,5})/g).toArray());
        if (listOfIds.length == 0) return;
        for (item of listOfIds) {
            moveIssue(jiraEmail, jiraToken, jiraUrl, item, transitionId, );
            addBuildComment(jiraEmail, jiraToken, jiraUrl, item, buildNumber);
        }  
      }
      start();     
}

function moveIssue(jiraEmail, jiraToken, jiraUrl, issueId, transitionId) {
    const options = {
        method: 'POST',
        url: `https://${jiraUrl}/rest/api/2/issue/${issueId}/transitions`,
        auth: {
            username: jiraEmail,
            password: jiraToken
        },
        body: {
            "update": {},
            "transition": {
            "id": transitionId
            },
            },
        json: true,
    }
    return new Promise(function (reject) {
        request(options)
            .catch(function (error) {
                reject(error);
            })
    });
}

function addBuildComment(jiraEmail, jiraToken, jiraUrl, issueId, buildNumber) {
  const options = {
    method: 'POST',
    url: `https://${jiraUrl}/rest/api/2/issue/${issueId}/comment`,
    auth: {
        username: jiraEmail,
        password: jiraToken
    },
    body: {
        'body': `Build number: ${buildNumber}`,
      },
      json: true
  }
  return new Promise(function(reject) {
    request(options)
      .catch(function(error) {
        reject(error);
      })
  });
}