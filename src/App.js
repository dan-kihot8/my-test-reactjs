import React, { Component } from 'react';
import './App.css';
import { ButtonGroup, Button } from 'bootstrap-4-react';
import { Container, Row, Col } from 'bootstrap-4-react';
import * as axios from 'axios';
import Editor from './Editor';
import $ from 'jquery';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.openEditor = this.openEditor.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onSexChange = this.onSexChange.bind(this);
    this.onFiredChange = this.onFiredChange.bind(this);
    this.onOfficeChange = this.onOfficeChange.bind(this);
    this.deleteEmployer = this.deleteEmployer.bind(this);
    this.state = {
      employers: [],
      offices: [],
      fullname: "",
      selectedDate: new Date("1990-01-01"),
      gender: "male",
      fired: false,
      office: "worker",
      editedId: -1
    };
    this.emptyEmployer = {
      birthdate: formatDate(new Date("1990-01-01")),
      fired: false,
      fullname: this.state.fullname,
      office: "worker",
      gender: "male"
    };
  }
  componentDidMount() {
    this.getUsers();
  };
  openEditor(e) {
    let dataIndex = e.target.getAttribute('data-index') || $(e.target).closest("tr").attr('data-index');
    let index = parseInt(dataIndex);
        $(".table tr").removeClass("active")
    let item;
    if (index !== -1) {

      $(e.target).closest("tr").addClass("active");
      item = this.state.employers[index];
    } else {
      item = this.emptyEmployer;
    }

    this.setState({
      gender: item.gender,
      fullname: item.fullname,
      selectedDate: convertToJsDate(item.birthdate),
      fired: item.fired,
      office: item.office,
      editedId: index
    });
  }

  deleteEmployer(e) {
    e.preventDefault();
    $(".table tr").removeClass("active")
    let newEmployers;
    if (this.state.editedId === -1 ) {
      alert("You need to choose row before!");
      return;
    }
    else {
      newEmployers = this.state.employers;
      newEmployers.splice(this.state.editedId, 1);
    }
    this.setState({
      employers: newEmployers,
      editedId: -1
    });
  }

  onDateChange(date) {
        this.setState({
      selectedDate: date,
    });
  };

  onSexChange(e) {
    this.setState({
      gender: e.target.value
    });
  };

  onNameChange(e) {
    this.setState({
      fullname: e.target.value
    });
  };

  onOfficeChange(e) {
    this.setState({
      office: e.target.value
    });
  };

  onFiredChange(e) {
        this.setState({
      fired: e.target.checked
    });
  };

  getUsers() {
    axios.get('./samples/default_data.json')
      .then((res) => {
        this.setState({
          employers: res.data.table,
          offices: res.data.offices
        });
      })
      .catch((err) => {});
  }
  
  save(e) {
    e.preventDefault();
    $(".table tr").removeClass("active")
    let employer =
      {
        birthdate: formatDate(this.state.selectedDate),
        fired: this.state.fired,
        fullname: this.state.fullname,
        office: this.state.office,
        gender: this.state.gender
      };
    
    let newEmployers = this.state.employers;
        if (this.state.editedId === -1 ) {
      if (this.state.fullname === "") {
        alert("Please input a fullname!")
        return
      }
      if (newEmployers.filter(
        i => i.fullname === employer.fullname && i.birthdate === employer.birthdate
      ).length > 0) {
        alert("Duplicate employer!");
        return;
      }
      newEmployers.push(employer);
    }
    else {
      newEmployers[this.state.editedId]=employer
    }
    this.setState({
      employers: newEmployers
    });

  }
 

  render() {

    return (
      <div className="App">
    <h1>Employers editor</h1>
    <Container>
      <ButtonGroup aria-label="Basic example">
      <Button 
        success
        onClick={this.openEditor}
        data-index="-1"
        title="Add employer"
      >Add
      </Button>
      <Button 
        danger
        onClick={this.deleteEmployer}
      >Delete
      </Button>
      </ButtonGroup>
    </Container>
    <div>
      <Row className="my-1 p-3">
      <Col col="12 lg-6" className="panel">
        <MyTable 
          employers={this.state.employers}
          openEditor={this.openEditor}
        />
      </Col>
      <Col col="12 lg-6" className="card">
        Editor
        <Editor 
        onSaveClick={this.save} 
        onDateChange={this.onDateChange}
        onOfficeChange={this.onOfficeChange}
        onNameChange={this.onNameChange}
        onSexChange={this.onSexChange}
        onFiredChange={this.onFiredChange}
        selectedDate={this.state.selectedDate}
        fullname={this.state.fullname}
        gender={this.state.gender}
        fired={this.state.fired}
        office={this.state.office}
        offices={this.state.offices}
        />
      </Col>
      </Row>
    </div>
    </div>
    );
  }

}


class MyTable extends Component {
  render() {
    return (
      <table className='table table-bordered'> 
        <thead>
        <tr> 
          <th>id</th>
          <th>fullname</th>
          <th>office</th>
          <th>birthdate</th>
          <th>gender</th>
          <th>fired</th>
        </tr>
        </thead>    
        <tbody>
          {this.props.employers.map((d, index) => {
            return (
            <tr className='p-4' key={ index }  
              data-index={index}
              onClick={this.props.openEditor}
            >
              <td className='index'> { index } </td>
              <td> { d.fullname } </td>
              <td> { d.office } </td>
              <td> { d.birthdate } </td>
              <td> { d.gender } </td>
              <td> <input type="checkbox" readOnly disabled checked={ d.fired }/> </td>
             </tr>
          )})}
        </tbody>
      </table>
    )
  }
}


function formatDate(d) {
  return d.toLocaleDateString("es-CL")
}
function convertToJsDate(sd) {
  var pattern = /(\d{2})-(\d{2})-(\d{4})/;
  return new Date(sd.replace(pattern,'$2-$1-$3'));
}