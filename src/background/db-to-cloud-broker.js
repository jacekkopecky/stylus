import dropbox from 'db-to-cloud/lib/drive/dropbox';
import onedrive from 'db-to-cloud/lib/drive/onedrive';
import google from 'db-to-cloud/lib/drive/google';

export const cloudDrive = {dropbox, onedrive, google, webdav: false};
export {dbToCloud} from 'db-to-cloud/lib/db-to-cloud';
