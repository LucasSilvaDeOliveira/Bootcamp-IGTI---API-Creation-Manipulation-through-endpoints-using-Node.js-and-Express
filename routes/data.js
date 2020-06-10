import express from 'express';
import { promises } from 'fs';
var router = express.Router();

const { readFile, writeFile } = promises;

// 1 - Rota Post

router.post('/', async (req, res) => {
  let grade = req.body;
  try {
    const data = await readFile(global.fileName, 'utf8');
    const json = JSON.parse(data);
    grade = { id: json.nextId++, ...grade, timestamp: new Date() };
    json.grades.push(grade);
    writeFile(global.fileName, JSON.stringify(json));
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// 2 - Rota put

router.put('/', async (req, res) => {
  let grade = req.body;
  try {
    const data = await readFile(global.fileName, 'utf-8');
    const json = JSON.parse(data);
    let selectedId = json.grades.findIndex((idToChange) => {
      return idToChange.id === grade.id;
    });
    if (selectedId) {
      /*       json.grades[selectedId].student = grade.student;
      json.grades[selectedId].subject = grade.subject;
      json.grades[selectedId].type = grade.type; */

      json.grades[selectedId].value = grade.value;
      await writeFile(global.fileName, JSON.stringify(json));
      res.end();
    } else {
      res.status(400).send({ error: err.message });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }

  // 3 - Rota get com id

  router.get('/:id', async (req, res) => {
    try {
      const data = await readFile(global.fileName, 'utf8');

      const json = JSON.parse(data);

      const getId = json.grades.find((grade) => {
        return grade.id == req.params.id;
      });
      res.send(getId);

      if (getId) {
        res.send(getId);
      } else {
        res.end();
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });

  // 4 - Rota delete com id

  router.delete('/:id', async (req, res) => {
    try {
      const data = await readFile(global.fileName, 'utf-8');
      const json = JSON.parse(data);
      const delId = json.grades.filter((grade) => {
        return grade.id !== parseInt(req.params.id);
      });
      json.grades = delId;
      await writeFile(global.fileName, JSON.stringify(json));
      res.end();
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

// Iniciando rota get - Com bifurcação
router.get('/', async (req, res) => {
  let grade = req.body;
  try {
    const data = await readFile(global.fileName, 'utf8');
    const json = JSON.parse(data);

    // 5 - Rota get - Retorna soma de notas - student / subject
    if (grade.student) {
      let getFilter = json.grades.filter((person) => {
        return (
          person.student === grade.student && person.subject === grade.subject
        );
      });
      let getData = getFilter.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);
      res.send({ value: getData });
    }

    // 6 - Rota get - Retorna média de notas - subject / type
    else if (grade.type) {
      let getFilter = json.grades.filter((person) => {
        return person.subject === grade.subject && person.type === grade.type;
      });
      let getData = getFilter.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);
      res.send({ value: getData / getFilter.length });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// 7 - Rota get - Retorna média de notas - subject / type
router.get('/top3', async (req, res) => {
  let topGrades = [];
  let grade = req.body;
  try {
    const data = await readFile(global.fileName, 'utf8');
    const json = JSON.parse(data);

    let getFilter = json.grades.filter((person) => {
      return person.subject === grade.subject && person.type === grade.type;
    });
    let sortedFilter = getFilter.sort((a, b) => {
      return b.value - a.value;
    });
    for (let i = 0; i < 3; i++) {
      topGrades.push(sortedFilter[i]);
    }
    res.send(topGrades);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
