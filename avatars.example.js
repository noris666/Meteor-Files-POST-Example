import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { FilesCollection } from 'meteor/ostrio:files';

export const Avatars = new FilesCollection({
	collectionName: 'avatars',
	allowClientCode: true,
	downloadRoute: '/images/',
	storagePath: 'assets/images/avatars/',
});

if (Meteor.isServer) {
  Meteor.publish('avatar', function () {
		if (!this.userId) {
			return this.ready();
		}  	

    return Avatars.findOne({
    	'meta.userId': this.userId
    }, {
    	fields: {
    		'_id': 1	
    	}
    }).cursor;
  });

	const _multer  = require('multer');
	const _fs = require('fs');
	const _multerInstanceConfig = { dest: '/tmp' }; // Temp dir for multer
	const _multerInstance = _multer(_multerInstanceConfig);
	
	Picker.middleware(_multerInstance.single('photo'));		

	Picker.route('/api/v1/upload', function(params, req, res, next) {
		if (req.file !== undefined && req.file.mimetype.substr(0, 6) == 'image/' && params.query.authToken.length) {
			const hashedToken = Accounts._hashLoginToken(params.query.authToken);
			const user = Meteor.users.findOne({ 'services.resume.loginTokens.hashedToken': hashedToken });

			if (user) {
				Avatars.remove({ 'meta.userId': user._id });

				_fs.stat(req.file.path, function (_statError, _statData) { 
					const _addFileMeta = {
						fileName: req.file.originalname,
						type: req.file.mimetype,
						size: req.file.size,
						meta: {
							userId: user._id
						}
					};

					_fs.readFile(req.file.path, function (_readError, _readData) {
						if (_readError) {
							console.log(_readError);
						} else {
							Avatars.write(_readData, _addFileMeta, function (_uploadError, _uploadData) {
								if (_uploadError) {
									console.log(_uploadError);
								} else {
									console.log('upload data=', _uploadData); 
									_fs.unlink(req.file.path); // remove temp upload
								}
							});
						}
					});
				});
			}
		}		

		res.end();
	});
}
