# orbit

### Description 
An application that lets you view the 3D models on your computer in gallery format. Built with Electron.


### TODO: 
- [x] Look into how to store the user state and keep them logged in, etc...
  - [x] Need to show the last logged in user at the top instad of 'Welcome to Orbit'
  - [ ] Caching file data (STL) somehow
      - Electron caching in the Appdata
      - Maybe zip or tar in Firebase
      
- [x] Consistent way to pull URLs from firebase
  - [x] Storing the users UID in Custom metadata
  - [ ] Append to database instead of overwriting
  - [ ] Search for UID 
