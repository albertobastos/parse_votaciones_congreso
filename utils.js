const getParam = function (url, param) {
	var query = url && url.split('?')[1];
    if (!query) return;

	var params = {};
    var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params[param];
};


module.exports = {
    getParam,
}