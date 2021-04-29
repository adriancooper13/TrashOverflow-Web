# COP4331-LargeProject - Trash Overflow

## Requirements

- [x] Email Verification
  - [x] Testing
  - [x] SendGrid
- [x] Forgot Password Email
  - [x] Testing
  - [x] SendGrid
  - [x] Forgot Password Page
- [ ] Mobile App
  - [x] ReactNative
  - [ ] Backend Code
  - [ ] ReactNative Components
- [x] Security
  - [x] Java Web Token
- [x] Invitation to HouseHold System
  - [x] Add / Remove Admins
  - [x] Invite Link Button
  - [x] Generate a Link that will add the user to a group
  - [x] Creator is permanate Admin
- [x] Register / Log in
- [x] Creation of Households
  - [x] Selection to create or join a new group
  - [x] FrontEnd Button
  - [x] Backend Code
- [x] Leaving a Household
  - [x] Button
  - [x] Alert
  - [x] Backend
- [x] View of Housegold info
  - [x] Group Member
  - [x] Group Admins
  - [x] Score Leaderboard
- [x] Creation of Chores
  - [x] Pool of Users
  - [x] A user responsible for the chore during the given iteration
- [x] Scheduleing of Chores
  - [x] Add / Remove User to Chores
- [x] Set How Often the Chore Reccurs
  - [x] If it even Reccurs
  - [x] Reccurance Should be set with a drop down menu
  - [x] If completed a non recurrning chore, delete it
- [x] Member List
  - [x] Promote
  - [x] Kick
  - [ ] ? Sort By Score ?
  - [x] Update after Chore Completion
- [ ] What do we do with Finished chores that still have time until the due date
- [x] Finish and Test Chores API
- [x] Create the Unit Testing
- [ ] Invalidate queries on chore member add / remove
  - [ ] Better to just invalidate the chores on every chore query including scheduling too since I think it might not be returning user info
- [ ] assigned user has a differnt icon

## API Endpoints (API Team Please Change)

---

| EndPoint           | Input Parameters                                                                                                                                              | Return Parameters                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| users/register     | name, password_hash, phone_number, email                                                                                                                      | \_id, name, password_hash, phone_number, email |
| users/login        | email, password_hash                                                                                                                                          | user, token                                    |
| users/edit         | name, password_hash, phone_number, email                                                                                                                      | TBD                                            |
| users/delete       | token, TBD                                                                                                                                                    | TBD                                            |
| groups/createGroup | token, TBD                                                                                                                                                    | error                                          |
| groups/editGroup   | token, TBD                                                                                                                                                    | error                                          |
| groups/deleteGroup | token, TBD                                                                                                                                                    | error                                          |
| groups/join        | token, group_ID, user_ID                                                                                                                                      | user, group, OR error                          |
| groups/leave       | token, group_ID, user_ID, group_place_holder_ID, group_member_ID                                                                                              | user, group, OR error                          |
| groups/remove      | token, group_ID, user_ID                                                                                                                                      | user, group, OR error                          |
| chores/add         | token, group_ID, newChore: {chore_assigned_users, chore_user_pool, chore_name, chore_description, chore_completion_status, chore_point_value, chore_schedule} | token, chore, group_chore_list, OR error       |
| EditRoomate.js     | token, TBD                                                                                                                                                    | error                                          |
| AddChore.js        | token, TBD                                                                                                                                                    | error                                          |
| EditChore.js       | token, TBD                                                                                                                                                    | error                                          |
| DeleteChore.js     | token, TBD                                                                                                                                                    | error                                          |

---

<!-- # Usage
### users/register
  *ROUTE*    POST api/users/register

  *DESC*     Register a user

  *ACCESS*   Public


```python
{ name, password_hash, phone_number, email}
``` -->

# Strech Goals

- [ ] Barcode scanner
- [ ] QR Code Compleation
- [ ] Link Invitation
- [ ] Chore tracker / statistics
- [ ] Add to the End / Sprinkle Throughout system for adding users to groups
- [ ] Hand over admin status
- [ ] Icons for chores
- [ ] Expanded View / List View Toggle
- [ ] About Page
- [ ] Group Color Theme
- [ ] Add More than 1 person to a given chore
  - Very Small Use Case

# Presentation Notes

- Introductions
  - Everyone will introduce themselves and their role
- Tech Used (Sam)
- Things that didn't go too well
  - Functional Vs. Class Components
- Things that went well
- SwagggerHub
  - Register / Emails
- Unit Testing
- Demo
  - Landing Page / Register
    - Phil
  - Admin Functions / Add Jo's User by link
    - Taylor
  - User's prespective
    - Jo

# Notes for 3-31 Check-up Meeting

- Currently using custom written Middleware for User Authenication using JSON Web Tokens
  - We also use JWT for the email verification and Forgot Password link
- Currently using Axios for all Client-Side requests
  - Heavily considering implementing, React-Query instead. (Auto-Cashe, Auto-Auth, Easy Loading Display)
- Email Verification has been implemented
  - We registed for SendGrid, a SMTP service
  - We Use NodeMailer to send email requests to SendGrid which then send out pre-written emails (HTML)
- All API Endpoints have been designed and written
  - Currently Working on Unit Testing
  - Currently finishing
- All MongoDB Schemas have been designed
  - We use Mongoose in our project allowing use to have Schema Models which can contain custom instance/static methods.
  - Examples include Group.addGroupMember(user_ID, cb)
    - and a custom written Pre-Save functions that are called before every DB save.
      - We use these to check for changed passwords and hash them.
      - And check for an empty group, and delete it.
- Completed FrontEnd Pages
  - Welcome
    - We used the welcome page as a way for the FrontEnd team to start learning react
  - Sign in
  - Register
  -
