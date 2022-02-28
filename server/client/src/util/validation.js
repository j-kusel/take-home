const regex = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // https://www.emailregex.com/
    date: /^\d{2}\/\d{2}\/\d{2}$/,
    time: /^\d{1,2}:\d{2}$/,
    state: /^[A-Za-z]{2}$/,
    zipcode: /^\d{5}$/
};

export default (str, len, re, cb) => {
    if (str.len > len)
        return false;
    if (re && !regex[re].test(str))
        return false;
    if (cb && !(cb()))
        return false;
    return true;
}
