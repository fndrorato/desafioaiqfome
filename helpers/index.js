const isNumber = (parameter) => {
    if (typeof parameter === 'number') {
        return true
    } else {
        return false
    }
}

module.exports = { isNumber }