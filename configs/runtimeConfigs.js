/**
 * @typedef {String} PermissionType
 **/


/**
 * @enum {PermissionType}
 */
var PERMISSION = {
    Admin: 'admin',
    Moderator: 'moderator',
    User: 'user'
}


let allPosibleOptions = {
    value: '', // Mandatory field with any content
    prefix: '',
    postfix: '',
    permission: PERMISSION.User // PermissionType (default: User)
}

let runtimeConfig = {
    volume: {
        value: 100,
        postfix: '%'
    },
    startTime: {
        value: (new Date()).toISOString(),
        permission: PERMISSION.Admin
    },
    mo: {
        value: false,
        permission: PERMISSION.Moderator
    },
    shuffle: {
        value: false
    },
    pause: {
        value: false
    },
    totalDownloading: {
        value: 0
    },
    currDownloading: {
        value: 0,
        permission: PERMISSION.Moderator
    },
}

const KEYS = {
    volume: 'volume',
    startTime: 'startTime',
    mo: 'mo',
    shuffle: 'shuffle',
    pause: 'pause',
    totalDownloading: 'totalDownloading',
    currDownloading: 'currDownloading',   
}

/* Autocompletion not working... */
/*let runtimeConfigKeys = Object.keys(runtimeConfig);
const KEYS = { };

runtimeConfigKeys.forEach((key) => {
    KEYS[key] = key;
})*/

/**
 * Set a runtime config value
 * @param {String} key 
 * @param {*} value 
 */
function setValue(key, value) {
    runtimeConfig[key].value = value;   
}

/**
 * Returns a value of a key in runtime config
 * @param {String} key 
 * @returns value
 */
function getValue(key) {
    return runtimeConfig[key].value;
}

/**
 * Get the runtime object info object depending on the permissions
 * @param {PermissionType} permission
 */
function getInfo( permission = PERMISSION.User ) {
    let configKeys = Object.keys(runtimeConfig);
    let infoObject = {};
    configKeys.forEach((key) => {
        let value = runtimeConfig[key];
        if (value.permission == undefined || value.permission == permission || (value.permission == PERMISSION.Moderator && permission == PERMISSION.Admin)) {
            infoObject[key] = `${value.prefix ? value.prefix : ''}${value.value}${value.postfix ? value.postfix : ''}`;
        }
    });
    return infoObject;
}

module.exports = {
    set: setValue,
    info: getInfo,
    get: getValue,
    PERMISSION: PERMISSION,
    KEYS: KEYS
}