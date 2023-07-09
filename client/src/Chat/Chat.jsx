import React, { useContext, useEffect, useRef, useState } from "react";

import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "../UserContext";
import Glogo from "../assets/Aleft.png";
import axios from 'axios'
import './style.css'
import Contact from "./Contact";
import { Link } from "react-router-dom";

function Chat() {
  const [newMessageText, setNewMessageText] = useState(""); // for inpt

  const [messages, setMessages] = useState([]);

  const divUnderMessages = useRef();


  const [offlinePeople,setOfflinePeople] = useState({});

  //step 1 to connected to ws

  const { username, id ,setId , setUsername } = useContext(UserContext); // to fidn the currect username

  const [ws, setWs] = useState(null); // set ws to state

  const [onlinePeople, setOnlinePeople] = useState({}); //state to store the online id

  const [selectedUserId, setSelectedUserId] = useState(null); // to store selected Id

  // ----- start ws -----

  useEffect(() => {
    connectToWs()       
  }, []);

                            // - function to reconnect ws---

function connectToWs(){
    const ws = new WebSocket("ws://localhost:4040"); //connect to ws
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener('close', ()=> {     // to help it reconnect becase its getting diconnected
        setTimeout(() => {
            console.log('Disconnected. Trying to connect...');
            connectToWs();
          }, 1000);
          
    })   
}

  function showOnlinePeople(peopleArray) {
    //to find the unique people from online object

    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username; // this give only the userid and username of all active
    //   console.log(people , 'people')  //* this has all the users id and username
    });
    setOnlinePeople(people);

    
    
  }


                    //!receiver function//

  function handleMessage(e) {
    //*function to handle message to receive from backend

    const messageData = JSON.parse(e.data); //*data -  is messgae data object from the backend
    console.log({ e, messageData });
    if ("online" in messageData) {
      // online is the object name
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]); //* this receive the messgae from the back end as obj coz its send in obj
    }
    
  }

                    //!sending from client function//

  function sendMessage(e,) {
    // submit hadnler
    e.preventDefault();
      
    console.log("sending..");
    ws.send(
      JSON.stringify({
        recipient: selectedUserId, //*send from front-end along with the selected user id
        text: newMessageText
        
        
      })
    );
    setNewMessageText(""); //* to empty inp field once sent

    setMessages((prev) => [
      //* this is to display the prev messgae sent
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
    
   
  }
                        //! ---- use effect for scroll ----

  useEffect(()=>{      //*using useeffect becasue it take a 0.5 mili sec for msg to come
    const div = divUnderMessages.current;
    if(div){
        div.scrollIntoView({ behavior: "smooth", block: "end" }); //*ensure for smooth scroll
    }
    
  },[messages]) //*message as dependency because we want to run this when ever message changes



            //! this useeffect is to get data from database///

  useEffect(()=>{
    if(selectedUserId){
        axios.get('/messages/' + selectedUserId).then(res=>{
            setMessages(res.data)
            
        })
        
    }
  },[selectedUserId])  //* here selecteduserid is added becase when ever a new user is selected we need data of that

    //! this useEffect is for to check if people are online ///

    useEffect(()=>{
        axios.get('/people').then(res=>{
        const offlinePeopleArr = res.data
        .filter(p => p._id !== id) //* checks if the received _id is same as our id
        .filter(p => !Object.keys(onlinePeople).includes(p._id));  //~ this filter the offline people
        const offlinePeople = {};
            offlinePeopleArr.forEach(p => {   //~ converting offlinepoeple to object
                offlinePeople[p._id] = p
            })

        setOfflinePeople(offlinePeople)
        // console.log(offlinePeople , 'offlinepeople')
        })
    } , [onlinePeople])




  const onlinePeopleExcluOurUser = { ...onlinePeople }; //* this delte our use from the object

  delete onlinePeopleExcluOurUser[id];



  //! Filter out duplicate messages based on 'id' property  ---

  const messagesWithoutDupes = messages.reduce((uniqueMessages, message) => {
    if (!uniqueMessages.some((m) => m._id === message._id)) {
      uniqueMessages.push(message);
    }
    return uniqueMessages;
  }, []);

        //!logout function

function logoutUser(){
  axios.post('/logout').then(()=>{
    setWs(null)
    setId(null);
    setUsername(null);
  })
}

      

       


  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col ">
        <div className="flex-grow">
        <Logo />

{/* apply other buttons here */}

{/* Dashboard */}

<div className={'border border-gray-100 py-4 flex items-center gap-3 cursor-pointer ml-2' }>
            <span className='text-gray-800 flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>


                Dashboard</span>
    </div>



                            {/* chats */}

                            {Object.keys(onlinePeopleExcluOurUser).map(userId => (
                                <Contact
                                key={userId}
                                id={userId}
                                online={true}
                                username={onlinePeopleExcluOurUser[userId]}
                                onClick={() => {setSelectedUserId(userId);console.log({userId})}}
                                selected={userId === selectedUserId} />
                            ))}
                            {Object.keys(offlinePeople).map(userId => (
                                <Contact
                                key={userId}
                                id={userId}
                                online={false}
                                username={offlinePeople[userId].username}
                                onClick={() => setSelectedUserId(userId)}
                                selected={userId === selectedUserId} />
                            ))}

                {/* setting */}

                   <div  className='border-b border-gray-100 py-5 pl-2 flex items-center gap-3 cursor-pointer ml-2'>
                            <span className='text-gray-800 flex gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                                </svg>


                                Settings</span>
                    </div>

        </div>
        <div className="p-2 text-center flex justify-between ml-4 mr-4">
          <span className="mr-2 text-sm text-gray-600 flex items-center gap-2 " >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
        </svg>

             {username}</span>
            <button onClick={logoutUser}
            className="text-sm text-black bg-blue-300 p-3 px-4 border rounded-sm flex gap-2" >logout
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>

            </button>
        </div>
       
      </div>

      {/* ---------------------text box from here-------------------------------  */}

      <div className=" flex flex-col bg-blue-300 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full flex-grow items-center justify-center">
              <div className="">
                <img src={Glogo} alt="" />
                <h2 className="text-white flex items-center justify-center ">
                  &larr; Select the Chat to Display{" "}
                </h2>
              </div>
            </div>
          )}
        {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map((message) => (
                  <div key={message._id} className={message.sender === id ? "text-right" : "text-left"}>
                  
                    <div className={"text-left inline-block p-3 my-2 rounded-md text-sm " +
                        (message.sender === id ? "bg-green-500 text-white": "bg-white text-gray-500")}>
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>

        {/* input box  */}
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Type Your message here"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="bg-white border p-2 flex-grow rounded-sm"
            />
         
            <button className="bg-blue-500 p-2 text-white rounded-sm" type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Chat;
