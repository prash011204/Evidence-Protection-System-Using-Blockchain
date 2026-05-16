const isLoggedIn = () => {
    const result = sessionStorage.getItem("isLoggedIn");
    if (result === "true") return true;
    if (result === "false") return false;
    return false;
};

const isAdmin = () => {
    const result = sessionStorage.getItem("isAdmin");
    if (result === "true") return true;
    if (result === "false") return false;
    return false;
};

// 👮 Police check
const isPolice = () => {
    return sessionStorage.getItem("role") === "police";
};

// 🧪 Forensic check
const isForensic = () => {
    return sessionStorage.getItem("role") === "forensic";
};

module.exports = { isLoggedIn, isAdmin, isPolice, isForensic };