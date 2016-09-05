# Meteor-Files-POST-Example
My implementation for uploading via POST route (Meteor Files, Multer, Picker)
You can check test route /api/v1/upload and send POST file field named 'photo'.
If you want replace field name you need find this string Picker.middleware(_multerInstance.single('photo'));

# Meteor packages
* meteorhacks:picker
* ostrio:files

# Node packages
* fs
* multer 
