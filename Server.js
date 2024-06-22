const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 8086

app.use(cors());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const database = mysql.createConnection({
  host: 'dk94.teaching.cs.st-andrews.ac.uk',
  user: 'dk94',
  password: 'tk3V!shm4sC207',
  database: 'dk94_mydb'
});

database.connect((err => {
  if (err) throw err;
  console.log('MySQL Connected');
}));

async function getUserId(username) {
  const result = await database.promise().query(
    `SELECT * FROM users WHERE users.username = ?`, 
    [username])

  console.log(result[0][0].userid);
  return result[0][0].userid;
}


app.get("/", (req, res) => {
  res.send("It's working!")
})

app.get("/steve", (req, res) => {
  res.send("It's working!")
})

// -------------------------------------------------
app.post("/create_account", (req, res) => {
  try {
    const infoPassed = req.body;
    console.log(infoPassed);

    database.query(
      `SELECT * FROM users WHERE users.username = ?`, [infoPassed.username], 
      (err, result) => {
      if (err) throw err;
      console.log(result);

      if (result.length > 0){
        res.send("Username taken");
      } else {
        database.query(
          `INSERT INTO users (username, password) VALUES (?, ?)`, [infoPassed.username, infoPassed.password],
          (err, result) => {
            if (err) throw err; else {
              res.send("User created");
            }
            console.log(result);
          }
        )
        
      }
    })
  } catch {
    console.log("Something went wrong querying the database...");
    res.send("Server error");
  }
})


app.post('/login', (req, res) => {

  try {
    const infoPassed = req.body;

    console.log(infoPassed);

    database.query(
      `SELECT * FROM users WHERE users.username = ? AND users.password = ?`, 
      [infoPassed.username, infoPassed.password], 
      (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.length > 0){
          res.send("Success");
        } else {
          res.send('Failure');
        }
      }
    )
  }
  catch {
    res.send("Server error");
  }
  
})

// -------------------------------------------------

app.post('/add_note', async (req, res) => {
  try {
    const noteInfo = req.body;
    const userid = await getUserId(noteInfo.user);

    database.query(
      `INSERT INTO notes (name, content, users_userid) VALUES (?, ?, ?)`,
      [noteInfo.name, noteInfo.content, userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
      }
    )

    database.query(
      `SELECT * FROM notes WHERE notes.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", notes: result});
      }
    )
  } catch (err) {
    console.log(err)
    res.send("Server error")
  }
})


app.post('/update_notes', async (req, res) => {
  try {
    console.log("Getting info passed...")
    const infoPassed = req.body;
    console.log(infoPassed);

    const user = req.body.user;
    console.log(user);
    const userid = await getUserId(user);

    database.query(
      `UPDATE notes SET notes.name = ?, notes.content = ? WHERE notes.users_userid = ? AND notes.noteid = ? `, 
      [infoPassed.name, infoPassed.content, userid, infoPassed.noteid], 
      (err, result) => {
        if (err) throw err;

        console.log(result);
      }
    )

    database.query(
      `SELECT * FROM notes WHERE notes.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", notes: result});
      }
    )


  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/get_notes', async (req, res) => {
  try {
    console.log("Getting info passed...")
    const infoPassed = req.body;
    console.log(infoPassed);

    const user = req.body.user;
    console.log(user);
    const userid = await getUserId(user);

    database.query(
      `SELECT * FROM notes WHERE notes.users_userid = ? `, 
      [userid], 
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", notes: result});
      }
    )
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
}) 

app.post('/delete_note', async (req, res) => {
  try {
    console.log("Getting info passed...")
    const infoPassed = req.body;
    console.log(infoPassed);

    const user = req.body.user;
    console.log(user);
    const userid = await getUserId(user);

    database.query(
      `DELETE FROM notes WHERE notes.users_userid = ? AND notes.noteid = ? `, 
      [userid, infoPassed.noteid], 
      (err, result) => {
        if (err) throw err;

        console.log(result);
      }
    )

    database.query(
      `SELECT * FROM notes WHERE notes.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", notes: result});
      }
    )


  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})

// -------------------------------------------------


app.post('/add_group', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `INSERT INTO itemgroups (itemgroups.name, itemgroups.users_userid) VALUES (?, ?)`,
      [infoPassed.name, userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
      }
    )

    database.query(
      `SELECT * FROM itemgroups WHERE itemgroups.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", groups: result});
      }
    )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/add_item', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `INSERT INTO items (items.title, items.content, items.startdate, items.enddate, items.position, items.users_userid, items.itemgroups_groupid) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [infoPassed.title, infoPassed.content, infoPassed.startdate, infoPassed.enddate, infoPassed.position, userid, infoPassed.groupid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
      }
    )

    database.query(
      `SELECT * FROM items WHERE items.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", items: result});
      }
    )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_item', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE items SET items.title = ?, items.content = ?, items.startdate = ?, items.enddate = ?
       WHERE items.users_userid = ? AND items.itemid = ?`,
      [infoPassed.title, infoPassed.content, infoPassed.startdate, infoPassed.enddate, userid, infoPassed.itemid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
      }
    )

    database.query(
      `SELECT * FROM items WHERE items.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", items: result});
      }
    )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_item_position', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE items SET items.position = ?, items.itemgroups_groupid = ?
       WHERE items.users_userid = ? AND items.itemid = ?`,
      [infoPassed.position, infoPassed.groupid, userid, infoPassed.itemid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success"});
      }
    )

  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_item_group', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE items SET items.itemgroups_groupid = ? 
       WHERE items.itemid = ?`,
      [infoPassed.group, infoPassed.itemid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
      }
    )

    database.query(
      `SELECT * FROM items WHERE items.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", items: result});
      }
    )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/get_groups', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `SELECT * FROM itemgroups WHERE itemgroups.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", groups: result});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/get_items', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `SELECT * FROM items WHERE items.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", items: result});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/delete_item', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `DELETE FROM items WHERE items.itemid = ? AND items.users_userid = ?`,
      [infoPassed.itemid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"})
      }
    )

    // database.query(
    //   `SELECT * FROM items WHERE items.users_userid = ?`,
    //   [userid],
    //   (err, result) => {
    //     if (err) throw err;

    //     console.log(result);
    //     res.send({response: "Success", items: result});
    //   }
    // )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_group_name', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE itemgroups SET itemgroups.name = ? 
       WHERE itemgroups.itemgroupid = ? AND itemgroups.users_userid = ?`,
      [infoPassed.name, infoPassed.groupid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"});
      }
    )

    // database.query(
    //   `SELECT * FROM items WHERE items.users_userid = ?`,
    //   [userid],
    //   (err, result) => {
    //     if (err) throw err;

    //     console.log(result);
    //     res.send({response: "Success", items: result});
    //   }
    // )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/delete_group', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `DELETE FROM items 
       WHERE items.users_userid = ? AND items.itemgroups_groupid = ?`,
      [userid, infoPassed.groupid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
      }
    )

    database.query(
      `DELETE FROM itemgroups
       WHERE itemgroups.itemgroupid = ? and itemgroups.users_userid = ?`,
      [infoPassed.groupid, userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success"});
      }
    )

  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


// -------------------------------------------------
/**
 * Paths for flashcards 
 */

app.post('/add_flashcard_set', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `INSERT INTO flashcardsets (flashcardsets.name, flashcardsets.users_userid) VALUES (?, ?)`,
      [infoPassed.name, userid],
      (err, result) => {
        if (err) throw err;

        res.send({response: "Success", setid: result.insertId});
      }
    )

    // database.query(
    //   `SELECT * FROM itemgroups WHERE itemgroups.users_userid = ?`,
    //   [userid],
    //   (err, result) => {
    //     if (err) throw err;

    //     console.log(result);
    //     res.send({response: "Success", groups: result});
    //   }
    // )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/add_flashcard', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `INSERT INTO flashcards (flashcards.question, flashcards.answer, flashcards.users_userid, flashcards.flashcardsets_flashcardsetid) 
       VALUES (?, ?, ?, ?)`,
      [infoPassed.question, infoPassed.answer, userid, infoPassed.flashcardsetid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success"})
      }
    )

    // database.query(
    //   `SELECT * FROM items WHERE items.users_userid = ?`,
    //   [userid],
    //   (err, result) => {
    //     if (err) throw err;

    //     console.log(result);
    //     res.send({response: "Success", items: result});
    //   }
    // )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/get_flashcard_sets', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `SELECT * FROM flashcardsets WHERE flashcardsets.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", sets: result});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/get_flashcards', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `SELECT * FROM flashcards WHERE flashcards.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", flashcards: result});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/delete_flashcard', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `DELETE FROM flashcards WHERE flashcards.flashcardid = ? AND flashcards.users_userid = ?`,
      [infoPassed.flashcardid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"})
      }
    )

    // database.query(
    //   `SELECT * FROM items WHERE items.users_userid = ?`,
    //   [userid],
    //   (err, result) => {
    //     if (err) throw err;

    //     console.log(result);
    //     res.send({response: "Success", items: result});
    //   }
    // )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_flashcard_set_name', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE flashcardsets SET flashcardsets.name = ? 
       WHERE flashcardsets.flashcardsetid = ? AND flashcardsets.users_userid = ?`,
      [infoPassed.name, infoPassed.flashcardsetid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"});
      }
    )

    // database.query(
    //   `SELECT * FROM items WHERE items.users_userid = ?`,
    //   [userid],
    //   (err, result) => {
    //     if (err) throw err;

    //     console.log(result);
    //     res.send({response: "Success", items: result});
    //   }
    // )

  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_flashcard', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE flashcards SET flashcards.question = ?, flashcards.answer = ?
       WHERE flashcards.flashcardid = ? AND flashcards.users_userid = ?`,
      [infoPassed.question, infoPassed.answer, infoPassed.flashcardid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"});
      }
    )

  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/delete_flashcard_set', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `DELETE FROM flashcards 
       WHERE flashcards.users_userid = ? AND flashcards.flashcardsets_flashcardsetid = ?`,
      [userid, infoPassed.flashcardsetid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
      }
    )

    database.query(
      `DELETE FROM flashcardsets
       WHERE flashcardsets.flashcardsetid = ? and flashcardsets.users_userid = ?`,
      [infoPassed.flashcardsetid, userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success"});
      }
    )

  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


// -------------------------------------------------
// Paths for repo

app.post('/get_linkgroups', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `SELECT * FROM linkgroups WHERE linkgroups.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", linkgroups: result});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/get_links', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `SELECT * FROM links WHERE links.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", links: result});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/add_linkgroup', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `INSERT INTO linkgroups (linkgroups.name, linkgroups.users_userid) VALUES (?, ?)`,
      [infoPassed.name, userid],
      (err, result) => {
        if (err) throw err;

        res.send({response: "Success", setid: result.insertId});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/add_link', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `INSERT INTO links (links.name, links.url, links.users_userid, links.linkgroups_linkgroupid) 
       VALUES (?, ?, ?, ?)`,
      [infoPassed.name, infoPassed.url, userid, infoPassed.linkgroupid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success"})
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_linkgroup_name', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE linkgroups SET linkgroups.name = ? 
       WHERE linkgroups.linkgroupid = ? AND linkgroups.users_userid = ?`,
      [infoPassed.name, infoPassed.linkgroupid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_link', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE links 
       SET links.name = ?, links.url = ?, links.linkgroups_linkgroupid = ?
       WHERE links.linkid = ? AND links.users_userid = ?`,
      [infoPassed.name, infoPassed.url, infoPassed.group, infoPassed.linkid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"});
      }
    )

  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/delete_linkgroup', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `DELETE FROM links 
       WHERE links.users_userid = ? AND links.linkgroups_linkgroupid = ?`,
      [userid, infoPassed.linkgroupid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
      }
    )

    database.query(
      `DELETE FROM linkgroups
       WHERE linkgroups.linkgroupid = ? and linkgroups.users_userid = ?`,
      [infoPassed.linkgroupid, userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success"});
      }
    )

  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/delete_link', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `DELETE FROM links WHERE links.linkid = ? AND links.users_userid = ?`,
      [infoPassed.linkid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"})
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})

// -------------------------------------------------

app.post('/get_quizlets', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `SELECT * FROM quizlets WHERE quizlets.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", quizlets: result});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/delete_quizlet', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `DELETE FROM quizlets WHERE quizlets.quizletid = ? AND quizlets.users_userid = ?`,
      [infoPassed.quizletid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"})
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/add_quizlet', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `INSERT INTO quizlets (quizlets.name, quizlets.quizletlink, quizlets.users_userid) 
       VALUES (?, ?, ?)`,
      [infoPassed.name, infoPassed.quizletlink, userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success"})
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_quizlet', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE quizlets 
       SET quizlets.name = ?, quizlets.quizletlink = ?
       WHERE quizlets.quizletid = ? AND quizlets.users_userid = ?`,
      [infoPassed.name, infoPassed.quizletlink, infoPassed.quizletid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"});
      }
    )

  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


// -------------------------------------------------

app.post('/get_google_docs', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `SELECT * FROM googledocs WHERE googledocs.users_userid = ?`,
      [userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success", googledocs: result});
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/delete_google_doc', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `DELETE FROM googledocs WHERE googledocs.googledocid = ? AND googledocs.users_userid = ?`,
      [infoPassed.googledocid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"})
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/add_google_doc', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `INSERT INTO googledocs (googledocs.name, googledocs.googledoclink, googledocs.users_userid) 
       VALUES (?, ?, ?)`,
      [infoPassed.name, infoPassed.googledoclink, userid],
      (err, result) => {
        if (err) throw err;

        console.log(result);
        res.send({response: "Success"})
      }
    )
  
  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})


app.post('/change_google_doc', async (req, res) => {
  try {

    const infoPassed = req.body;
    console.log(infoPassed);
    const userid = await getUserId(infoPassed.user);

    database.query(
      `UPDATE googledocs 
       SET googledocs.name = ?, googledocs.googledoclink = ?
       WHERE googledocs.googledocid = ? AND googledocs.users_userid = ?`,
      [infoPassed.name, infoPassed.googledoclink, infoPassed.googledocid, userid],
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send({response: "Success"});
      }
    )

  } catch (err) {
    console.log(err);
    res.send({response: "Server error"});
  }
})

// -------------------------------------------------
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})