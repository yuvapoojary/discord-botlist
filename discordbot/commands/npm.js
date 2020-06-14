const { RichEmbed} = require ("discord.js");
const moment = require ("moment");
const fetch = require ("node-fetch");
exports.run = async(client,message,args) => {
  try {
  const pkg = args[0];
const res = await fetch(`https://registry.npmjs.com/${pkg}`);
		if (res.status === 404) {
			return message. reply("> Couldn't find that npm!");};
		const body = await res.json();
  
		if (body.time.unpublished) {
			return console.log(" return");}
		const version = body['dist-tags'] ? body.versions[body['dist-tags'].latest] : {};
		const maintainers = timArray(body.maintainers.map(user => user. name));
		const dependencies = version.dependencies ? timArray(Object.keys(version.dependencies)) : null;
		const embed = new RichEmbed()
			.setColor(0xcb0000)
			.setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
			.setTitle(body.name)
			.setURL(`https://www.npmjs.com/package/${pkg}`)
			.setDescription(body.description || 'No description.')
			.addField('❯ Version', body['dist-tags'].latest ?  body ['dist-tags'].latest:"Unknown")
			.addField('❯ License', body.license || 'None', true)
			.addField('❯ Author', body.author ? body.author.name : 'Unknown', true)
			.addField('❯ Creation Date', moment.utc(body.time.created).format('YYYY/MM/DD hh:mm:ss'), true)
			.addField('❯ Modification Date', moment.utc(body.time.modified).format('YYYY/MM/DD hh:mm:ss'), true)
			.addField('❯ Main File', version.main || 'index.js', true)
			.addField('❯ Dependencies', dependencies. length ? dependencies.join(',') : 'None')
			.addField('❯ Maintainers', maintainers.join(', '));

		message. channel. send(embed);
  } catch (r) {
    console.log(r);
  };
	}

	function timArray(arr) {
		if (arr.length > 10) {
			const len = arr.length - 10;
			arr = arr.slice(0, 10);
			arr.push(`${len} more...`);
		}

		return arr;
	}
