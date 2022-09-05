# redup
CLI tools. Bridge between Upsource and Redmine through git repos.
Create Upsource review and update Redmine issue.

## Installation

`npm install -g @llioss/redup`

`yarn global add @llioss/redup`

## Usage

Your branch should follow the pattern: feature/[RM/rm][-]123456.
Ex.: feature/rm-123456 or feature/RM-123456

The cli create a new Upsource merge review, then update your Redmine status with a note containing the Upsource review link.

`redup create-review`

## Configuration

Create a file named `.reduprc` in your git root folder.

Available config are:

| name                   | Value                                                       |
|------------------------|-------------------------------------------------------------|
| UPSOURCE_HOST          | Your Upsource host. ex: myupsource.host                     |
| UPSOURCE_PROJECT_ID    | MY-UPSOURCE-PROJECT-ID                                      |
| UPSOURCE_USER_API_TOKEN | Your user token created in Upsource                         |
| REDMINE_HOST           | Your Redmine host. ex: redmine.host                         |
| REDMINE_USER_API_TOKEN | Your user token created in Redmine                          |
| REDMINE_STATUS_ID_NEW_REVIEW | Redmine status to set when a new Upsource review is created |
