/**
 * @ Author: Komil Guliev
 * @ Create Time: 2020-01-23 21:41:30
 * @ Modified by: Komil Guliev
 * @ Modified time: 2020-04-04 12:14:48
 * @ Description:
 */

const		fs = require('fs');

var			global = null;

function	config_init()
{
	let		content = fs.readFileSync("./config/configs.json");
	if (!content)
	{
		console.log("No cofiguration!");
		console.log("Please, check your configuration, then restart service!");
	}
	else
		global = JSON.parse(content);
}
var global2 = {
	CONFIG_ID: '335',
	VARIANT_CNT: 14,
	GITLAB_DOMAIN: 'https://git.miem.hse.ru/api/v4',
	GITLAB_ACCESS_TOKEN: 'NzscasW5nsQwGpshCgEx',
	GITLAB_PROJECT_NAME: 'exam',
	GITLAB_STUDENTS_INFO: 'gitlab_scripts/students.json',
	GITLAB_FILES: ['code1.c', 'code2.c'],

	GRADER: {
		PATH: 'grader_scripts/',
		TASK1: 'user_task1.c',
		TASK2: 'user_task2.c',

		BINARY_DELET: true,

		TASK_STATUS: ["FAIL", "OK", "ERROR", "TIME_OUT"]
	},

	VALGRIND: {
		CMD: "valgrind",
		LOG_FILE: "valgrindLog",
		TEMPLATES: {
			EXIST_LEAK: "%BYTES% байта %TYPE% утечек в %NUM% блоках",
			NOT_EXIST: "Нет %TYPE% утечек в программе",
			NO_LEAKS: "Все блоки кучи были освобождены - утечки невозможны",
		},
		LEAKS_MESSAGES: {
			definitely: "точных",
			indirectly: "косвенных",
			possibly: "возможных",
		}
	},

	TASKS_INFO: null,

	CLASSROOM: {
		COURSEWORK: "Экзамен"
	},
	ADMIN: {
		EMAIL: "c.grader2@miem.hse.ru",
		NAME: "Комил"
	}
}

config_init();

module.exports = global;