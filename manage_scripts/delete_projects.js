/**
 * @ Author: Komil Guliev
 * @ Create Time: 2020-03-19 15:14:42
 * @ Modified by: Komil Guliev
 * @ Modified time: 2020-04-01 00:33:35
 * @ Description:
 */

const		gitlab = require('../gitlab_scripts/gitlab');
const		global = require('../configs/global')
const		args = process.argv.slice(2);


function			setFlags(flags)
{
	let		i = 0;
	while (i < args.length)
	{
		let		item = args[i].split('=');
		console.log(item);

		if (item[0] == '--gmail' && item[1])
			flags.gmail = item[1];
		else if (item[0] == '--group' && item[1])
			flags.group = item[1];
		else if (item[0] == '--git-prefix' && item[1])
			flags.gitPrefix = item[1];
		else if (item[0] == '--pr-ids' && item[1])
			flags.prIds = item[1].split(' ');
		else if (item[0] == '--cw-title' && item[1])
			flags.cwTitle = item[1];
		else if (item[0] == '--cw-ids' && item[1])
			flags.cwIds = item[1].split(' ');
		else if (item[0] == '--active')
			flags.active = 1;
		else if (item[0] == '--not-active')
			flags.active = 0;
		else if (item[0] == '--all')
			flags.all = 1;
		else if (item[0] == '--ignore')
			flags.ignore = 1;
		i++;
	}
}

async function		getProjects()
{
	let		content;

	content = JSON.parse(await	gitlab.getRepoFile(global.CONFIG_ID, "projects.json"));
	if (!content)
		return false;
	else
		return content.projects;
}

function			showProjects(projects)
{
	projects.forEach(el => {
		console.log(
			el.gmail, " ",
			el.projectId, " ", 
			el.cwId, " ",
			el.group, " ",
		);
	});
}

async function		deleteProjects()
{
	const		flags = {
		active: -1,
		all: 0,
		ignore: 0
	};
	let			projects;
	let			fprojects;

	// setting flags
	setFlags(flags);

	// reading projects info
	projects = await getProjects()
	if (!projects || !projects.length)
	{
		console.log("No projects found!")
		return ;
	}

	fprojects = [...projects];
	console.log("FLAGS: ", flags);

	if (flags.ignore)
	{
		gitlab.deleteProjects(flags.prIds);
		return 0;
	}

	//console.log(projects);

	if (!flags.all)
	{
		if (flags.active == 0 || flags.active == 1)
			projects = projects.filter(el => {
				let	active = new Date(el.createdDate + el.limit)  <= new Date();

				if (active == flags.active)
					return true;
				return false;
			});

		if (flags.gmail)
			projects = projects.filter(el => el.gmail == flags.gmail);

		if (flags.group && !flags.gmail)
			projects = projects.filter(el => el.group == flags.group);
		
		if (flags.prIds)
			projects = projects.filter(el => flags.prIds.includes(el.projectId ? el.projectId.toString() : null));
		
		if (flags.cwIds)
			projects = projects.filter(el => flags.cwIds.includes(el.cwId));
		
		if (flags.cwTitle)
			projects = projects.filter(el => el.cwTitle == flags.cwTitle);
	}

	fprojects = fprojects.filter(el => {
		let		i = 0;
		while (i < projects.length)
			if (el.projectId == projects[i++].projectId || !el.projectId)
				return false;
		
		if (!projects.length)
			return true;
	})

	projects = projects.filter(el => {
		if (el.projectId)
			gitlab.deleteProject(el.projectId);
	});

	const   params = {
		branch: 'master',
		content: JSON.stringify({ projects: fprojects }),
		'commit_message': 'created new projects'
	};

	gitlab.put(`/projects/${global.CONFIG_ID}/repository/files/projects.json`, params);

	showProjects(projects);

}

deleteProjects();