import React, { Component } from 'react';
import { Button, Form } from 'bootstrap-4-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default  class Editor extends Component {
    render() {
        const maleCheked = (this.props.gender === "male")
        const femaleCheked = (this.props.gender === "female")

        return (
            <Form className="text-left">
       <Form.Group>
          <label htmlFor="fullname">Fullname</label>
          <Form.Input type="text" id="fullname" placeholder="Enter fullname" 
            value={this.props.fullname} onChange={this.props.onNameChange} />
        </Form.Group>
        
        <label>Birth date:</label>
        <div className="" id="dateItem">
          <DatePicker
            selected={this.props.selectedDate}
            onChange={this.props.onDateChange}
            dateFormat='dd-MM-yyyy'
          />
        </div>
        
        <label>Office</label>
        <Form.CustomSelect 
          id="officeSelect"
          key="offices"
          onChange={this.props.onOfficeChange} 
          value={this.props.office}
          defaultValue={this.props.offices[0]}
        >
          {this.props.offices.map((d, index) => {
            return (
              <option key={index} value={d}>{d}</option>
            )})}
        </Form.CustomSelect>

        <label>Sex</label>
        <Form.Group>
          <Form.Check>
            <Form.Radio id="maleRadio" defaultChecked checked={maleCheked}
              name="genderRadio" onChange={this.props.onSexChange} value="male"
            />
            <Form.CheckLabel htmlFor="maleRadio">male</Form.CheckLabel>
          </Form.Check>
          <Form.Check>
            <Form.Radio id="femaleRadio" checked={femaleCheked}
              name="genderRadio" onChange={this.props.onSexChange} value="female"
            />
            <Form.CheckLabel htmlFor="femaleRadio">female</Form.CheckLabel>
          </Form.Check>
        </Form.Group>

        <Form.Group>
          <Form.Check>
            <Form.CheckInput type="checkbox" id="firedCheck" checked={this.props.fired}
                onChange={(e) => {this.props.onFiredChange(e)}}
            />
            <Form.CheckLabel htmlFor="firedCheck">Fired</Form.CheckLabel>
          </Form.Check>
        </Form.Group>


        <Button primary type="sumbit" onClick={this.props.onSaveClick}>Save</Button>
      </Form>
        )
    }
}