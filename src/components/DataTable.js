import React from 'react';
import Table from 'react-bootstrap/Table';
import data from '../assets/data.json';

//Returns <tr> from data from JSON file
const populateTable = (data) => {
  let rows = []; //list of <tr> elements to be initialized with data from 'data'
  for (let i = 0; i < data.length; i++) {
    const row = 
    (<tr>
      <td>{data[i].ID}</td>
      <td>{data[i].date}</td>
      <td>{data[i].raterID}</td>
      <td>{data[i].correctAnsw3}</td>
      <td>{data[i].correctAnsw5}</td>
      <td>{data[i].raterAnsw3}</td>
      <td>{data[i].raterAnsw5}</td>
      <td>{data[i].ID}</td>
      <td>{data[i].compare3}</td>
      <td>{data[i].compare5}</td>
    </tr>)
    rows.push(row)
  }
  return rows;
}

const table = data.table;

const DataTable = () => {
    return (
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Date</th>
      <th>Rater</th>
      <th>Correct Answer 3 Label</th>
      <th>Correct Answer 5 Label</th>
      <th>Rater Answer 3 Label</th>
      <th>Rater Answer 5 Label</th>
      <th>Task ID</th>
      <th>-</th>
      <th>-</th>
    </tr>
  </thead>
  <tbody>
    {populateTable(table)}
  </tbody>
</Table>
    )
}

export default DataTable;