
      import React from "react";
      import ReactDOM from "react-dom";
      import store from "./TodoStore";
      
      export default class TodoList extends React.Component {
        getInitialState() {
          const initialData = [
            {id: "S001", workDescription: "チケットを予約する", selected: false},
            {id: "S002", workDescription: "掃除をする", selected: false},
            {id: "S003", workDescription: "アプリを開発する", selected: false}
          ];
          return {
            data: initialData,
            alternative: initialData,
            uncheckedCount: initialData.length,
            radio: "all",
            lastID: ""
          };
        };
        componentDidMount() {
          window.setInterval(() => {
            let allWorks = this.state.data;
            const uncheckedWorks = allWorks.filter(d => !d.selected);  
            notifyMe(uncheckedWorks);
          }, 600000);
        };
        // displayName: 'Excel',
        render() {
          var checks = this.state.alternative.map(function(d) {
          return (
            <section>
              <input type="checkbox" id={d.id} checked={d.selected} onChange={this.__changeSelection.bind(this, d.id)} />
              <label className="checkLabel" htmlFor={d.id}>{d.workDescription}</label>
              <button className="destroyRow" onClick={() => {this.__destroyRow(d.id)}}>×</button>
              <br />
            </section>
            );
          }.bind(this));
          return (
            <div>
              <section>
                <h3>todos</h3>
                <section className="boxShadow">
                  <section className="textAndButton">
                    <button className="checkAllButton" onClick={this.__checkAll}>∨</button>
                    <input type="text" className="inputText" onKeyPress={this.__addRow} />
                  </section>
                  <section>
                    {checks}
                    <section className="checkInfo">
                      <td>{this.state.uncheckedCount + " items left"}
                        <input type="radio" id="radioAll" checked={this.state.radio==="all"} onChange={() => {this.__selectCheckedRow("all")}} />
                        <label className="radioLabel" htmlFor="radioAll">All</label>
                        <input type="radio" id="radioActive" checked={this.state.radio==="active"} onChange={() => {this.__selectCheckedRow("active")}} />
                        <label className="radioLabel" htmlFor="radioActive">Active</label>
                        <input type="radio" id="radioCompleted" checked={this.state.radio==="completed"} onChange={() => {this.__selectCheckedRow("completed")}} />
                        <label className="radioLabel" htmlFor="radioCompleted">Completed</label>
                        <button className="destroyRows" onClick={this.__destroyCheckedRow}>Clear completed</button>
                      </td>
                    </section>
                  </section>
                </section>
              </section>
            </div>
          );
        };

        __changeSelection(id) {
          let uncheckedCount = 0;
          let nextRows = this.state.data.map(function(d) {
            if (d.id === id) {
              if(d.selected) {
                uncheckedCount++;
              }
            }
            else if (d.selected === false) {
              uncheckedCount++;
            }
            return {
              id: d.id,
              workDescription: d.workDescription,
              selected: (d.id === id ? !d.selected: d.selected)
            };
          });
          this.setState({data: nextRows, alternative: nextRows, uncheckedCount: uncheckedCount});
        };

        __addRow(e) {
          if (e.charCode === 13) {
            const nextRows = this.state.data;
            const extID = test();
            const nextID = test();
            console.log("testid", nextID);
            const additionalRows = {
              id: nextID,
              workDescription: e.target.value,
              selected: false 
            };
            nextRows.push(additionalRows);
            let uncheckedCount = this.state.uncheckedCount;
            uncheckedCount++;
            this.setState({data: nextRows, alternative: nextRows, uncheckedCount: uncheckedCount});
          }
        };

        __checkAll() {
          let nextRows = this.state.data.map(function(d) {
            return {
              id: d.id,
              workDescription: d.workDescription,
              selected: true
            };
          });
          this.setState({data: nextRows, alternative: nextRows,  uncheckedCount: 0});
        };

        __destroyRow(id) {
          const needlessId = id;
          const nextRows =this.state.data.filter(d => d.id !== needlessId);
          let uncheckedCount = this.state.uncheckedCount;
          uncheckedCount--;
          this.setState({data: nextRows, alternative: nextRows, uncheckedCount: uncheckedCount});
        };

        __destroyCheckedRow() {
          const nextRows = this.state.data.filter(d => !d.selected);
          const uncheckedCount = nextRows.length;
          this.setState({data: nextRows, alternative: nextRows, uncheckedCount: uncheckedCount});
        };

        __selectCheckedRow(status) {
          let currentRows = this.state.data;
          let nextRows = currentRows;
          switch (status) {
            case "all":
              break;
            case "active":
              nextRows = currentRows.filter(d => !d.selected);
              break;
            case "completed":
              nextRows = currentRows.filter(d => d.selected);
              break;
            default:
              console.log("default");
          }
          this.setState({alternative: nextRows, radio: status});
        };

      }

      
      
      const initialData = [
            {id: "S001", workDescription: "チケットを予約する", selected: false},
            {id: "S002", workDescription: "掃除をする", selected: false},
            {id: "S003", workDescription: "アプリを開発する", selected: false}
          ];

      var test = function() {
        let nextRows = initialData;
        console.log(nextRows);
        var lastID = (nextRows[(nextRows.length) - 1]).id;
        return function() {
          const nextNumber = Number(lastID.slice(1)) + 1;
          let nextID = "S";
          if (nextNumber < 10) {
            nextID = nextID + "00" + nextNumber;
          }
          else if (nextNumber < 100) {
            nextID = nextID + "0" + nextNumber;
          }
          return nextID;
        };
      }();
      
      //ReactDOM.render(
        //React.createElement(Excel, {
          //initialData: initialData,
        //}),
        //document.getElementById("app")
      //);

      function notifyMe(data) {
        if (!("Notification" in window)) {
        alert("このブラウザは通知をサポートしていません");
        }
        else if (Notification.permission === "granted") {
          let notification = new Notification("未完了の作業があります");
        }
        else if (Notification.permission !== "denied") {
          Notification.requestPermission(function (permission) {
            if (permission === "granted") {
              let notification = new Notification("未完了の作業があります");
            }
          });
        }
        let works = "";
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            works = data[i].workDescription;
            continue;
          }
          works = works + "," + data[i].workDescription;
        }
        spawnNotification(works, "em.png", "本日の作業");
      }

      function spawnNotification(theBody,theIcon,theTitle) {
        var options = {
          body: theBody,
          icon: theIcon
        }
        var n = new Notification(theTitle,options);
        setTimeout(n.close.bind(n), 5000); 
      }