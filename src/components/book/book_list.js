import React, {
  Component
} from 'react'
import Item from './book_item'
import './book.scss'
import {Button,Modal} from 'antd';
import jQuery from 'jquery'
import axios from 'axios'

export class BookList extends Component {

    constructor(props) {
      super(props);
      this.state = {
        book: [],
        query: "",
        filteredData: [],
        visible: false,
        fields: {},
        errors: {}
      };
      this.handleChange = this.handleChange.bind(this);
      this.submitnewBook = this.submitnewBook.bind(this);
    }

    componentDidMount() {
      this.getBooks()
    }

    getBooks() {
      return axios.get("https://api.myjson.com/bins/pvjdg")
        .then(response => {
          console.log('get',response.data)
          return response.data;
        });
      // let bb = (this.state.book || []).map((d, index) => {
      //   return d
      // })
      // console.log(this.state.book)
      // fetch("https://api.myjson.com/bins/hw8lz")
      //   .then(res => res.json())
      //   .then(
      //     (res) => {
      //       const {
      //         query
      //       } = this.state;

      //       this.props.addTrack(res.tracks)
      //       const filteredData = res.tracks.filter(element => {
      //         return element.name.toLowerCase().includes(query.toLowerCase());
      //       });
      //       this.setState({
      //         track: res.tracks,
      //         filteredData
      //       });

      //     },
      //     (err) => {
      //       console.log(err)
      //     }
      //   )
    }

    handleChange(e) {
      let fields = this.state.fields;
      fields[e.target.name] = e.target.value;
      this.setState({
        fields
      });

    }

    putBook(updatedData) {
        axios.put('https://api.myjson.com/bins/pvjdg',
            updatedData, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
          .then(response => {
            console.log('res',response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    submitnewBook(e) {
      e.preventDefault();
      if (this.validateForm()) {
        const $ = window.$;
        let fields = {};
        fields["bookName"] = "";
        fields["url"] = "";
        fields["author"] = "";
        fields["date"] = "";
        this.setState({
          fields: fields
        });
        let hh = JSON.stringify({
          name: this.state.fields.bookName,
          url: this.state.fields.url,
          author: this.state.fields.author,
          date: this.state.fields.date
        })
      
          this.getBooks().then(data => {
            console.log('data',data)
            console.log(hh)
            let push = data
            push.push(hh)
            // push.toString().replace(/"(\w+)"\s*:/g, '$1:')
            console.log('hh', push)
            this.state.book = push;
            console.log('book',this.state.book)
            this.putBook(this.state.book)
          });
        // jQuery.ajax({
        //   url: "https://api.myjson.com/bins",
        //   type: "POST",
        //   data: hh,
        //   contentType: "application/json; charset=utf-8",
        //   dataType: "json",
        //   success: function (data, textStatus, jqXHR) {
        //   console.log(JSON.stringify(data.uri))
        //   // this.setState({
        //   //      book: JSON.stringify(data.uri)
        //   // });
        //   jQuery.get(data.uri, function (data, textStatus, jqXHR) {
        //     var json = JSON.stringify(data);
        //     this.state.book.push(json)
        //     this.setState({
        //          book: json
        //     });
        //     console.log(json)
        //   }.bind(this));
        //   }.bind(this)
        // });
        this.setState({
          visible: false,
        });
      }
    }

    validateForm() {
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      if (!fields["bookName"]) {
        formIsValid = false;
        errors["bookName"] = "*Please enter Book name.";
      }

      if (typeof fields["bookName"] !== "undefined") {
        if (!fields["bookName"].match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["bookName"] = "*Please enter alphabet characters only.";
        }
      }

      if (!fields["date"]) {
        formIsValid = false;
        errors["date"] = "*Please enter Relese Date.";
      }

      if (typeof fields["date"] !== "undefined") {
        //regular expression for date validation
        var pattern = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/);
        if (!pattern.test(fields["date"])) {
          formIsValid = false;
          errors["date"] = "*Please enter valid date.";
        }
      }

      if (!fields["author"]) {
        formIsValid = false;
        errors["author"] = "*Please enter author name.";
      }

      if (typeof fields["author"] !== "undefined") {
        if (!fields["author"].match(/^[a-zA-Z ]*$/)) {
          formIsValid = false;
          errors["author"] = "*Please enter alphabet characters only.";
        }
      }

      if (!fields["url"]) {
        formIsValid = false;
        errors["url"] = "*Please upload your image.";
      }

      this.setState({
        errors: errors
      });
      return formIsValid;
    }

    showModal = () => {
      this.setState({
        visible: true,
      });
    };

    handleOk = e => {
      this.submitnewBook(e);
    };

    handleCancel = e => {
      this.setState({
        visible: false,
      });
    };

  render() {
    return ( 
    < div className = "container" > 
      < div >
        <Button type = "primary"
          style = {
            {
              fontSize: "1rem"
            }
          }
          onClick = {this.showModal} > ADD NEW Book 
        </Button>    
        <Modal title = "ADD Book"
          visible = {this.state.visible}
          onOk = {this.handleOk}
          onCancel = {this.handleCancel} 
        >
        <form method = "post"
        name = "newBook"
        onSubmit = { this.submitnewBook} >
        <label > Book Name </label>   
        <input type = "text"
          name = "bookName"
          value = {this.state.fields.bookName}
          onChange = {this.handleChange}
      />     
      < div className = "errorMsg" > {this.state.errors.bookName} </div>    
        <label > Release Date </label>   
        <input type = "text"
          name = "date"
          value = {this.state.fields.date}
          onChange = {this.handleChange}
      />    
      <div className = "errorMsg" > {this.state.errors.date} </div>    
        <label > author Name </label>   
        <input type = "text"
          name = "author"
          value = {this.state.fields.author}
          onChange = {this.handleChange}
      />    
      <div className = "errorMsg" > {this.state.errors.author} </div>    
        <label > Upload Cover Book </label>   
         < input type = "file"
            name = "url"
            value = {this.state.fields.url}
            onChange = {this.handleChange}
            accept = "image/*" />
      <div className = "errorMsg" > {this.state.errors.url} </div> 
        </form >  
        </Modal>  
        </div >
        < Item/>
     {/* {
       this.getBooks()
     } */}
    </div>
    )
  }
}
export default BookList;