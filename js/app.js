var model = {
	numberDays: 12,
	students: {
		"stu1": {
			"name": "Slappy the Frog"
		},
		"stu2": {
			"name": "Lilly the Lizard"
		},
		"stu3": {
			"name": "Paulrus the Walrus"
		},
		"stu4": {
			"name": "Gregory the Goat"
		},
		"stu5": {
			"name": "Adam the Anaconda"
		}
	}
};

var view =  {
	initHeader: function(){
		for (var i=1;i<=octopus.getNumberDays();++i){
			$("#table-header").append("<th>"+i+"</th>");
		}
		$("#table-header").append('<th class="missed-col">Days Missed-col</th>');
	},
	initAStudent: function(studentID){
		this.initAStudentHTML(studentID);		
		this.registerAStudentsEvents(studentID);
	},
	initAStudentHTML: function(studentID){
		var getThisStudent = octopus.getThisStudent(studentID);
		
		var studentHTML = '<tr class="student" id="row-'+studentID+'">';
		studentHTML = studentHTML + '<td class="name-col">'+getThisStudent.name+'</td>';
		
		for (var i=1; i<=octopus.getNumberDays();++i){
			var id = 'input-'+studentID+'-'+i;
			studentHTML = studentHTML + '<td class="attend-col" id="'+id+'"><input type="checkbox"></td>';
		}
        $("#student-body").append(studentHTML+'<td class="missed-col">0</td></tr>');
		
	},
	registerAStudentsEvents: function(studentID){
		for (var i=1; i<=octopus.getNumberDays();++i){
			var id = 'input-'+studentID+'-'+i;
			$("#"+id).click(function(event){ view.onClick(event)});
		}
	},
	initStudents: function(){
		for(var studentID in model.students) {
			this.initAStudent(studentID);
			this.renderStudent(studentID, octopus.getThisAttendance(studentID));
		}
	},
	renderStudent: function(studentID, attendance){
		var row = document.getElementById("row-"+studentID);
		var daysChecked = $(row).children("td").children("input");
		
		for (var i=0; i<daysChecked.length;++i){
			$(daysChecked[i])[0].checked=attendance[i];
		}

		this.renderMissed(studentID,attendance);		
		//	attendance.push($(daysChecked[i]).prop("checked"));
	},
	renderMissed: function(studentID, attendance){
		var missed = attendance.reduce(function(n, val) {
			return n + (val === false);
		}, 0);
		
		var row = document.getElementById("row-"+studentID);
		
		$(row).children("td")[octopus.getNumberDays()+1].textContent=missed;
		
	},
	onClick: function(event){
		var idArray = event.currentTarget.id.split("-");
		var currentStudent = idArray[1];
		var currentDay = idArray[2];
	
		var attendance = octopus.getThisAttendance(currentStudent);
		attendance[currentDay-1]=event.target.checked;
		octopus.updateAStudentAttendance(currentStudent,attendance);
		view.renderMissed(currentStudent, attendance);
	}
}

var octopus = {
	getNumberDays: function(){
		return model.numberDays;
	},
	getThisStudent: function(studentID){
		return model.students[studentID];
	},
	initAttendance: function(){
		if (!localStorage.attendance) {
			console.log('Creating attendance records...');
		
			var attendance = {};
		
			for (studentID in model.students){
				attendance[studentID] =[];
			
				for (var i = 0; i <= model.numberDays-1; i++) {
					attendance[studentID].push(Math.random() >= 0.5);
				}
			}
			localStorage.attendance = JSON.stringify(attendance);
		}
		else{
			var attendance = JSON.parse(localStorage.attendance);
		}
		model.attendance = attendance;
    },
	"getThisAttendance": function(studentID){
		return model.attendance[studentID];
	},
	"updateAStudentAttendance": function(studentID, attendance){
		model.attendance[studentID]=attendance;
		localStorage.attendance = JSON.stringify(model.attendance);
		
	}
};
$(document).ready(function(){
	view.initHeader();
	octopus.initAttendance();
	view.initStudents();
	});

