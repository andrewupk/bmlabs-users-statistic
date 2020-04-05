var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/db.db');

function checkTables(){
    db.serialize(() => {
        db.all(`SELECT name FROM sqlite_master WHERE type='table';`, [], (err, rows) => {
            if (err) {
                throw err;
            }
            if (rows.length === 0){
                console.log('Empty');
                createTables();
            } else {
                console.log(rows);
            }
        });
    });
}

function createTables(){
    console.log('It is needed to create tables');
    db.serialize(() => {
        db.run(`CREATE TABLE "users" (
            "id"	INTEGER,
            "first_name"	TEXT,
            "last_name"	TEXT,
            "email"	TEXT,
            "gender"	TEXT,
            "ip_address"	TEXT,
            PRIMARY KEY("id")
        )`).
        run(insertUsersIntoTables()).
        run(`CREATE TABLE "users_statistic" (
            "user_id"       INTEGER,
            "date"          TEXT,
            "page_views"    INTEGER,
            "clicks"        INTEGER
        )`).
        run(insertUsersStatisticIntoTables());
    });
    
    
}

function insertUsersIntoTables(){
    var fs = require('fs');
    var users = JSON.parse(fs.readFileSync('./data/users.json'));
    var sql = `INSERT INTO users(id, first_name, last_name, email, gender, ip_address) VALUES`;
    users.forEach (user => {
        sql += `(` + user.id + `, "` + user.first_name + `", "` + user.last_name + `", "` + user.email + `" , "` + user.gender + `", "` + user.ip_address + `"),`;
    });
    return sql.substring(0, sql.length-1);
}

function insertUsersStatisticIntoTables(){
    var fs = require('fs');
    var statistics = JSON.parse(fs.readFileSync('./data/users_statistic.json'));
    var sql = `INSERT INTO users_statistic(user_id, date, page_views, clicks) VALUES`;
    statistics.forEach (statistic => {
        sql += `(` + statistic.user_id + `, "` + statistic.date + `", ` + statistic.page_views + `, ` + statistic.clicks + `),`;
    });
    return sql.substring(0, sql.length-1);
}

function getUsers(response, count = 10, page = 1){
    let first_user = (page - 1) * count;
    let sql = `SELECT users.id, users.first_name, users.last_name, users.email, users.gender, users.ip_address, sum (users_statistic.page_views) total_page_views, sum (users_statistic.clicks) total_clicks
                FROM users INNER JOIN users_statistic on users.id = users_statistic.user_id
                GROUP BY users.id
                ORDER BY users.id
                LIMIT ` + first_user + `, ` + count;
    console.log(first_user, count);
    db.all(sql, [], (err, users) => {
        if (err) {
//            return JSON.stringify({result: false});
            response.status(200).jsonp({result: false});
        } else {
//            return JSON.stringify({result: true, users: users});
            response.status(200).jsonp({result: true, users: users});
        }
    });
}

function getUsersCount(response){
    let sql = `SELECT users.id, users.first_name, users.last_name, users.email, users.gender, users.ip_address, sum (users_statistic.page_views) total_page_views, sum (users_statistic.clicks) total_clicks
                FROM users INNER JOIN users_statistic on users.id = users_statistic.user_id
                GROUP BY users.id
                ORDER BY users.id`;
    db.all(sql, [], (err, users) => {
        if (err) {
//            return JSON.stringify({result: false});
            response.status(200).jsonp({result: false});
        } else {
//            return JSON.stringify({result: true, users: users});
            response.status(200).jsonp({result: true, length: users.length});
        }
    });
}

function getUserStatistic(response, id, timeFrom=0, timeTo=0){
    let sql;
    if ((timeFrom === 0) && (timeTo === 0)){
        sql = `SELECT * FROM users_statistic
                    WHERE users_statistic.user_id = ` + id + 
                    ` LIMIT 0, 7`;
    } else {
        let from = moment(timeFrom).format("YYYY-MM-DD");
        let to = moment(timeTo).format("YYYY-MM-DD");
        sql = `SELECT * FROM users_statistic
                    WHERE users_statistic.user_id = ` + id + 
                    ` AND date >= '` + from + `' AND date <= '` + to + `'`;
    }

    db.all(sql, [], (err, stats) => {
        if (err) {
//            return JSON.stringify({result: false});
            response.status(200).jsonp({result: false});
        } else {
            let clicks = [];
            let page_views = [];
            let date = [];
            stats.forEach(stat => {
                clicks.push(stat.clicks);
                page_views.push(stat.page_views);
                date.push(stat.date);
            });
            db.get(`SELECT first_name, last_name FROM users WHERE id = ` + id, [], (err, row) => {
                if (err){
                    response.status(200).jsonp({result: false});
                } else {
//                    return JSON.stringify({result: true, users: users});
                    response.status(200).jsonp({result: true, stats: {
                        clicks: clicks,
                        views: page_views,
                        date: date,
                        user_name: row.last_name + " " + row.first_name
                    }});
                }
            });
        }
    });
}

module.exports.checkTables = checkTables;
module.exports.getUsers = getUsers;
module.exports.getUsersCount = getUsersCount;
module.exports.getUserStatistic = getUserStatistic;