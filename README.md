# move-jira-issue

This action based on jessicazu/trello-github-actions and made for:

* Finding issue number(s) in PR body and title
* Changing jira issue(s) status + adding comment to the jira issue with build number (from variable GITHUB_RUN_NUMBER).

Env: 

JIRA_EMAIL: Your Jira email

JIRA_API_TOKEN: Your Jira API token

JIRA_URL: Your Jira domain name

JIRA_TRANSITION_ID: transition ID of your issue https://docs.atlassian.com/software/jira/docs/api/REST/7.6.1/#api/2/issue-getTransitions

How to use:

      - name: Move jira issue 
        uses: the-real-mpgames/move-jira-issue@v3
        with:
          jira-action: move_issue_when_pull_request_closed
        env:
          JIRA_EMAIL:  ${{ secrets.JIRA_EMAIL }}
          JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
          JIRA_URL: ${{ secrets.JIRA_URL }}
          JIRA_TRANSITION_ID: "41"