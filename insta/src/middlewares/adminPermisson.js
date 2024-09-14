const adminPermission = (user) => {
    if (user == true) {
        return true;
    } else {
        return false;
    }
}

module.exports = adminPermission;