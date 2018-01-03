import { fso, shell, fileStreamFactory } from './activex';
import { fetchBinary } from './network';
import { log } from './utils';
const storagePath = `${fso.getParentFolderName(WScript.ScriptFullName)}/storage`;
const programsPath = `${fso.getParentFolderName(WScript.ScriptFullName)}/programs`;
if (!fso.folderExists(storagePath)) {
    fso.createFolder(storagePath);
}

export const executeLocal = command => {
    shell.Run(`${programsPath}/${command}`, 1, true);
};

export const executeLocalBackground = command => {
    shell.Run(`${programsPath}/${command}`, 1);
};


export const execute = command => {
    shell.Run(command, 1, true);
};

export const executeHidden = command => {
    shell.Run(command, 0, true);
};

export const createFolder = path => {
    if (!fso.folderExists(`${storagePath}/${path}`)) {
        fso.createFolder(`${storagePath}/${path}`);
    }
};

export const folderExists = path => {
    return fso.folderExists(`${storagePath}/${path}`);
};

export const saveToFile = (path, data, globalPath=false) => {
    const file = fso.createTextFile(globalPath ? path : `${storagePath}/${path}`);
    const resultData = Array.isArray(data) ? data.join('\r\n') : data;
    file.Write(resultData);
    file.close();
};

export const readFile = path => {
    log(path);
    return fso.getFile(`${storagePath}/${path}`).openAsTextStream(1, 0).readall();
};

export const appendToFile = (path, data) => {
    if (!fso.fileExists(`${storagePath}/${path}`)) {
        saveToFile(path, data);
    }
    else {
        const file = fso.getFile(`${storagePath}/${path}`).openAsTextStream(8,0);
        const resultData = Array.isArray(data) ? data.join('\r\n') : data;
        file.Write(resultData);
        file.close();
    }
};

export const downloadFile = (url, path) => {
    const fs = fileStreamFactory();
    fs.Type = 1;
    fs.Mode = 3;
    fs.Open();
    fs.Write(fetchBinary(url));
    WScript.Echo(`${storagePath}/${path}`);
    fs.SaveToFile(`${storagePath}/${path}`, 2);
    fs.Close();
};

export const getFilesList = path => {
    const files = [];
    const _files = new Enumerator(fso.getFolder(`${storagePath}/${path}`).Files);
    for (; !_files.atEnd(); _files.moveNext()) {
        files.push(_files.item()+'');
    }
    return files;
};

export const getFilesListAbsolute = path => {
    const files = [];
    const _files = new Enumerator(fso.getFolder(path).Files);
    for (; !_files.atEnd(); _files.moveNext()) {
        files.push(_files.item()+'');
    }
    return files;
};


export const getSubFoldersList = path => {
    const folders = [];
    const _folders = new Enumerator(fso.getFolder(`${storagePath}/${path}`).subFolders);
    for (; !_folders.atEnd(); _folders.moveNext()) {
        folders.push(_folders.item()+'');
    }
    return folders;
};