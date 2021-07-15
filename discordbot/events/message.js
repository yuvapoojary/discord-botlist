const check = require("syntax-error");
const Discord = require("discord.js");

module.exports = (client, message) => {
  // ignore bots and dm commands
  if (message.author.bot || !message.guild) return;
  let code = null;
  let react;
  let regex = /```([\s\S]*?)```/g;
  let match = regex.exec(message.content);

  if (match) {
    if (!code) {
      // If we reach this it means no online file input


      code = match[1].trim();
      if (code.length <= 0)
      {
        react = false;
      }
    }


    let match2 = regex.exec(message.content);
    if (match2) { // two codeblocks? wtf?
      code = match2[1].trim();

    }

    let discordLanguages = ["1c", "abnf", "accesslog", "actionscript", "ada", "apache", "applescript",
	"arduino", "armasm", "asciidoc", "aspectj", "autohotkey", "autoit", "avrasm",
	"awk", "axapta", "bash", "basic", "bnf", "brainfuck", "bf", "c", "cal", "capnproto", "ceylon",
	"clean", "clojure-repl", "clojure", "cmake", "coffeescript", "coq", "cos",
	"cpp", "crmsh", "crystal", "cs", "csharp", "csp", "css", "d", "dart", "delphi", "diff",
	"django", "dns", "dockerfile", "dos", "dsconfig", "dts", "dust", "ebnf",
	"elixir", "elm", "erb", "erlang-repl", "erlang", "excel", "fix", "flix", "fortran",
	"fsharp", "gams", "gauss", "gcode", "gherkin", "glsl", "go", "golo", "gradle", "groovy",
	"haml", "handlebars", "haskell", "haxe", "hsp", "htmlbars", "http", "hy", "inform7",
	"ini", "irpf90", "java", "javascript", "jboss-cli", "json", "js", "julia-repl", "julia",
	"kotlin", "lasso", "ldif", "leaf", "less", "lisp", "livecodeserver", "livescript",
	"llvm", "lsl", "lua", "makefile", "markdown", "mathematica", "matlab", "maxima",
	"mel", "mercury", "mipsasm", "mizar", "mojolicious", "monkey", "moonscript", "n1ql",
	"nginx", "nimrod", "nix", "nsis", "objectivec", "ocaml", "openscad", "oxygene",
	"parser3", "perl", "pf", "php", "pony", "powershell", "processing", "profile",
	"prolog", "protobuf", "puppet", "purebasic", "python", "py", "q", "qml", "r", "rib",
	"roboconf", "routeros", "rsl", "ruby", "ruleslanguage", "rust", "scala", "scheme",
	"scilab", "scss", "shell", "smali", "smalltalk", "sml", "sqf", "sql", "stan", "stata",
	"step21", "stylus", "subunit", "swift", "taggerscript", "tap", "tcl", "tex", "thrift",
	"tp", "twig", "typescript", "vala", "vbnet", "vbscript-html", "vbscript", "verilog",
    "vhdl", "vim", "x86asm", "xl", "xml", "xquery", "yaml", "zephir"
    ];

    let stop = 0;
    while (code.charAt(stop) != '\n' && code.charAt(stop) != ' ' && stop < code.length) {
      stop++;
    }

    let substr = code.substr(0, stop);
    for (let i = 0; i < discordLanguages.length; i++) {
      if (substr.toLowerCase() == discordLanguages[i]) {
        code = code.replace(substr, '');
        break;
      }
    }
  };
  if (code) {
    const syntax = check(code);
    if (syntax) {

      message.react("❌");
      message.react("❓");
      const filter = (reaction, user) => reaction.emoji.name === "❓" && user.id != client.user.id;

      const collector = message.createReactionCollector(filter, { time: 60000 });
      collector.on('collect', r => {
        if (r.emoji.name === "❓") {
          const embed = new Discord.MessageEmbed()
            .setDescription(`\`\`\`Position${syntax. toString (). replace ("(anonymous file)",""). replace ("\n","")} \`\`\` `)
            .setColor("ff0000")
            .setTitle("ERROR");
          message.channel.send(embed);
        };
      });
    } else {
      message.react("✅");
    };
  };
  // make sure message starts with prefix
  if (message.content.indexOf(client.config.bot.prefix) !== 0) return;

  // slice off prefix & command, we're left with parameters.
  const args = message.content.slice(client.config.bot.prefix.length).trim().split(/ +/g);
  // slices off the params, lowercases the command name. we're left with command name
  const command = args.shift().toLowerCase();

  // grab the command file from the enmap with command name.
  const cmd = client.commands.get(command);
  // exits event if command is not defined.
  if (!cmd) return;
  try {

    // runs the file and passes the client, message and params to the file.
    cmd.run(client, message, args);
  } catch (r) {
    message.channel.send(r);
  }
};