const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mysql=require("mysql2");

 
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Qwerty@1",
    database:"plannerdb"
});
//Global Systems//
var studentid;
var facultyid;
var workshop_adminid;
//Global Systems//
app.get("/",function(req,res){
    res.render("sp_login");
});
app.get("/Admin",function(req,res){
    res.render("Admin");
});
app.get("/logout",function(req,res){
    res.redirect("/");
});
app.get("/Student",function(req,res){
    let qry="SELECT * FROM student_course where student_id="+studentid;
    let qry1="SELECT username FROM students where id="+studentid;
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            con.query(qry1,function(err,ans){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("st_homepage",{data:result,usname:ans});
                }
            })
           
        }
    });
   
});
app.get("/Events",function(req,res){
    let qry1="SELECT N_id,N_Message,Timing,nt.course_id,Type FROM notification as nt inner join student_course as st WHERE nt.course_id=st.course_id AND st.student_id="+studentid+" UNION select * from notification where Type='Workshop' ORDER BY Timing ASC";
    let qry="SELECT * FROM student_course where student_id="+studentid;
    let qry2="SELECT username FROM students where id="+studentid;
    var val;
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            val=result;
        }
    });
    con.query(qry1,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            con.query(qry2,function(err,answer){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("Events",{data:result,data1:val,usname:answer});
                }
            })
            
        }
    })

})
app.get("/schedule",function(req,res){
    let qry="SELECT * FROM student_course where student_id="+studentid;
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("schedule",{data:result});
        }
    });
});
app.get("/Plan",function(req,res){
    let qry="SELECT * FROM activity WHERE sid="+studentid;
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("list", { Title: "Today", myTask:result });
        }
    })
});
app.get("/Faculty",function(req,res){
    let qry="SELECT * FROM faculty_course WHERE fid="+facultyid;
    let qry2="SELECT * FROM faculties WHERE id="+facultyid;
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            con.query(qry2,function(err,answer){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("Faculty",{data:result,usname:answer});
                }
            })
            
        }
    })
})
app.get("/Workshop",function(req,res){
    let qry="SELECT * FROM workshop_admin where id="+workshop_adminid;
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("Workshop",{usname:result});
        }
    })
});

app.post("/Admin",function(req,res){
    const uname=req.body.usrname;
    const password=req.body.pswd;
    const option=req.body.opt;
    let qry1="INSERT INTO students (username,password) values ('"+uname+"','"+password+"')";
    let qry2="INSERT INTO faculties (username,password) values ('"+uname+"','"+password+"')";
    let qry3="INSERT INTO workshop_admin (username,password) values ('"+uname+"','"+password+"')";
    if(option==1){
        con.query(qry1,function(err){
            if(err){
                console.log(error);
            }
            else{
                res.redirect("/Admin");
            }
        })
    }
    else if(option==2){
        con.query(qry2,function(err){
            if(err){
                console.log(error);
            }
            else{
                res.redirect("/Admin");
            }
        })
    }
    else{
        con.query(qry3,function(err){
            if(err){
                console.log(error);
            }
            else{
                res.redirect("/Admin");
            }
        })
    }
});
app.get("/Add",function(req,res){
    res.render("add");
});
app.get("/Workshop",function(req,res){
    res.redirect("Workshop");
})
app.post("/",function(req,res){
    const username=req.body.uname;
    const password=req.body.pwd;
    const option=req.body.opt;
    if(option==1){
    let qry="SELECT * FROM admin WHERE username='"+username+"' AND "+"password='"+password+"'";
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result==0){
                console.log("Invalid Credentials");
            }
            else{
                res.redirect("/Admin");
            }
        }
    })
}
else if(option==2){
    let qry="SELECT * FROM students WHERE username='"+username+"' AND "+"password='"+password+"'";
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result==0){
                console.log("Invalid Credentials");
            }
            else{
                studentid=result[0].id;
                res.redirect("/Student");
            }
        }
    })
}
else if(option==3){
    let qry="SELECT * FROM faculties WHERE username='"+username+"' AND "+"password='"+password+"'";
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result==0){
                console.log("Invalid Credentials");
            }
            else{
                facultyid=result[0].id;
                res.redirect("/Faculty");
            }
        }
    })
}
else{
    let qry="SELECT * FROM workshop_admin WHERE username='"+username+"' AND "+"password='"+password+"'";
    con.query(qry,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result==0){
                console.log("Invalid Credentials");
            }
            else{
                workshop_adminid=result[0].id;
                res.redirect("/Workshop");
            }
        }
    })
}
});
app.post("/Student",function(req,res){
    const code=req.body.code;
    let qry1="SELECT * FROM courses WHERE courseid='"+code+"'";
    con.query(qry1,function(err,ans){
        if(err){
            console.log(err);
        }
        else{
            if(ans.length!=0){
                let qry="INSERT INTO student_course (student_id,course_id) values ("+studentid+",'"+code+"')";
    con.query(qry,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/Student");
        }
    })
            }
            else{
            res.send(500,"Wrong");
            }
        }
    })
    
});
app.post("/Plan",function(req,res){
    const task=req.body.Task;
    let qry="INSERT INTO activity (task,sid) values ('"+task+"',"+studentid+")";
    con.query(qry,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/Plan");
        }
    })
});
app.post("/delete",function(req,res){
    const itmToDelete=req.body.checkedItem;
    let qry="DELETE FROM activity WHERE id="+itmToDelete;
    con.query(qry,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/Plan");
        }
    })
});
app.post("/Add",function(req,res){
    const code= req.body.code;
    const cname=req.body.naam;
    const department=req.body.dep;
    let qry1="INSERT INTO courses (courseid,courseName,Department) values ('"+code+"','"+cname+"','"+department+"')";
    let qry2="INSERT INTO faculty_course (fid,cid) values ("+facultyid+",'"+code+"')";
    con.query(qry1,function(err){
        if(err)
        console.log(err);
        else{
            con.query(qry2,function(err){
                if(err)
                console.log(err);
                else{
                    res.redirect("/Add");
                }
            })
        }
    })
});
app.post("/Faculty",function(req,res){
    const topic=req.body.topic;
    const timing=req.body.time;
    const course=req.body.opt;
    const type=req.body.opt1;
    var ans;
    if(type==1){
        ans="Assigment";
    }
    else if(type==2){
        ans="Quiz";
    }
    else if(type==3){
        ans="Lectures";
    }
    else{
        ans="Exams";
    }
    let qry="INSERT INTO notification (N_Message,Timing,course_id,Type) values ('"+topic+"','"+timing+"','"+course+"','"+ans+"')";
    con.query(qry,function(err){
        if(err)
        console.log(err);
        else{
            res.redirect("/Faculty");
        }
    });
});
app.post("/Workshop",function(req,res){
    const topic=req.body.topic;
    const time=req.body.time;
    const type=req.body.option;
    let qry="INSERT INTO notification (N_Message,Timing,course_id,Type) values ('"+topic+"','"+time+"','"+type+"','Workshop')";
    con.query(qry,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/Workshop");
        }
    })
});
app.listen(3000,function(req,res){
    console.log("Server started at port 3000");
});
























// con.connect(function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Database connection established");
//     }
// });
// let qry="SELECT * from users_details";
// con.query(qry,function(err,result){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(result);
//     }
// });
