/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Project } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/project.service';
import { SubprojectType } from 'app/entities/subproject-type/subproject-type.model';
import { SubprojectTypeService } from 'app/entities/subproject-type/subproject-type.service';
import { Subproject } from 'app/entities/subproject/subproject.model';
import { SubprojectService } from 'app/entities/subproject/subproject.service';
import { Task } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/task.service';
import { User } from 'app/entities/user/user.model';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'mss-users-dialog',
  templateUrl: './projects-dialog.component.html',
  styleUrls: ['./projects-dialog.component.scss']
})
export class ProjectsDialogComponent implements OnInit {
  user: User | null = null;

  type?: 'addProject' | 'editProject' | 'addSubproject' | 'editSubproject' | 'addTask' | 'editTask';
  parent?: any;
  obj?: any;
  subprojectTypes: SubprojectType[] = [];

  taskForm = this.fb.group({
    name: [{ value: '', disabled: false }, Validators.required],
    fromDate: [{ value: new Date(), disabled: false }, Validators.required],
    toDate: [{ value: new Date(), disabled: false }, [Validators.required]],
    hoursPredicted: [{ value: null, disabled: false }, Validators.required],
  });

  projectForm = this.fb.group({
    name: [{ value: '', disabled: false }, Validators.required],
    code: [{ value: '', disabled: false }, Validators.required],
    dateFrom: [{ value: new Date(), disabled: false }, Validators.required],
    dateTo: [{ value: new Date(), disabled: false }, [Validators.required]],
    hoursPredicted: [{ value: null, disabled: false }, Validators.required],
  });

  subprojectForm = this.fb.group({
    name: [{ value: '', disabled: false }, Validators.required],
    code: [{ value: '', disabled: false }, Validators.required],
    dateFrom: [{ value: new Date(), disabled: false }, Validators.required],
    dateTo: [{ value: new Date(), disabled: false }, [Validators.required]],
    hoursPredicted: [{ value: null, disabled: false }, Validators.required],
    subprojectType: [{ value: new SubprojectType(), disabled: false }, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public messageService: MessageService,
    private subprojectTypeService: SubprojectTypeService,
    private projectService: ProjectService,
    private subprojectService: SubprojectService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.type = this.config.data.type;
    this.obj = this.config.data.obj;
    this.parent = this.config.data.parent;
    console.log(this.type);
    console.log(this.obj);
    console.log(this.parent);

    if (this.type === 'addSubproject' || this.type === 'editSubproject') {
      this.loadSubprojectTypes();
    }

    if (this.type === 'editProject') {
      if (!this.obj) { this.ref.close(); }
      this.projectForm.patchValue(this.obj);
      this.projectForm.patchValue({ dateFrom: new Date(this.obj.dateFrom) });
      this.projectForm.patchValue({ dateTo: new Date(this.obj.dateTo) });
    }

    if (this.type === 'editSubproject') {
      if (!this.obj) { this.ref.close(); }
      this.subprojectForm.patchValue(this.obj);
      this.subprojectForm.patchValue({ dateFrom: new Date(this.obj.dateFrom) });
      this.subprojectForm.patchValue({ dateTo: new Date(this.obj.dateTo) });
    }

    if (this.type === 'editTask') {
      if (!this.obj) { this.ref.close(); }
      this.taskForm.patchValue(this.obj);
      this.taskForm.patchValue({ fromDate: new Date(this.obj.fromDate) });
      this.taskForm.patchValue({ toDate: new Date(this.obj.toDate) });
    }
  }

  loadSubprojectTypes(): void {
    this.subprojectTypeService.findAll().subscribe({
      next: (res) => {
        this.subprojectTypes = res.body ?? [];
        if (this.subprojectTypes.length === 0) {
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się pobrać typów podprojektów.' });
        } else if (this.type === 'editSubproject') {
          console.log(this.subprojectTypes.find(type => type.id === this.obj.subprojectTypeId));
          this.subprojectForm.patchValue({ subprojectType: this.subprojectTypes.find(type => type.id === this.obj.subprojectTypeId) });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się pobrać typów podprojektów.' });
      }
    })
  }

  addProject(): void {
    const { name, code, dateFrom, dateTo, hoursPredicted } = this.projectForm.value;
    dateFrom?.setHours(1);
    dateTo?.setHours(1);
    if (dateFrom! > dateTo! || dateFrom === dateTo) {
      this.messageService.add({ severity: 'warn', summary: 'Błąd', detail: 'Data od nie może być późniejsza od daty do' });
      return;
    }
    const project = new Project(
      null, name, code, dateFrom, dateTo, hoursPredicted
    );
    this.projectService.addProject(project).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie dodano projekt.' });
        this.ref.close({ success: true });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać projektu.' });
      }
    });
  }

  editProject(): void {
    const { name, code, dateFrom, dateTo, hoursPredicted } = this.projectForm.value;
    dateFrom?.setHours(1);
    dateTo?.setHours(1);
    if (dateFrom! > dateTo! || dateFrom === dateTo) {
      this.messageService.add({ severity: 'warn', summary: 'Błąd', detail: 'Data od nie może być późniejsza od daty do' });
      return;
    }
    const project = new Project(
      this.obj.id, name, code, dateFrom, dateTo, hoursPredicted
    );
    this.projectService.editProject(project).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie edytowano projekt.' });
        this.ref.close({ success: true });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się edytować projektu.' });
      }
    });
  }

  addSubproject(): void {
    const { name, code, dateFrom, dateTo, hoursPredicted, subprojectType } = this.subprojectForm.value;
    dateFrom?.setHours(1);
    dateTo?.setHours(1);
    if (dateFrom! > dateTo! || dateFrom === dateTo) {
      this.messageService.add({ severity: 'warn', summary: 'Błąd', detail: 'Data od nie może być późniejsza od daty do' });
      return;
    }
    const subproject = new Subproject(
      null, name, code, dateFrom, dateTo, hoursPredicted, subprojectType!.id, this.parent.id
    );
    this.subprojectService.addSubproject(subproject).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie dodano podprojekt.' });
        this.ref.close({ success: true });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać podprojektu.' });
      }
    });
  }

  editSubproject(): void {
    const { name, code, dateFrom, dateTo, hoursPredicted, subprojectType } = this.subprojectForm.value;
    dateFrom?.setHours(1);
    dateTo?.setHours(1);
    if (dateFrom! > dateTo! || dateFrom === dateTo) {
      this.messageService.add({ severity: 'warn', summary: 'Błąd', detail: 'Data od nie może być późniejsza od daty do' });
      return;
    }
    const subproject = new Subproject(
      this.obj.id, name, code, dateFrom, dateTo, hoursPredicted, subprojectType!.id, this.parent.id
    );
    this.subprojectService.editSubproject(subproject).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie edytowano podprojekt.' });
        this.ref.close({ success: true });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się edytować podprojektu.' });
      }
    });
  }

  addTask(): void {
    const { name, fromDate, toDate, hoursPredicted } = this.taskForm.value;
    fromDate?.setHours(1);
    toDate?.setHours(1);
    if (fromDate! > toDate! || fromDate === toDate) {
      this.messageService.add({ severity: 'warn', summary: 'Błąd', detail: 'Data od nie może być późniejsza od daty do' });
      return;
    }
    const task = new Task(
      null, name, this.parent.id, this.parent.code, this.parent.name, fromDate, toDate, hoursPredicted
    );
    this.taskService.addTask(task).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie dodano zadanie.' });
        this.ref.close({ success: true });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać zadania.' });
      }
    });
  }

  editTask(): void {
    const { name, fromDate, toDate, hoursPredicted } = this.taskForm.value;
    fromDate?.setHours(1);
    toDate?.setHours(1);
    if (fromDate! > toDate! || fromDate === toDate) {
      this.messageService.add({ severity: 'warn', summary: 'Błąd', detail: 'Data od nie może być późniejsza od daty do' });
      return;
    }
    const task = new Task(
      this.obj.id, name, this.parent.id, this.parent.code, this.parent.name, fromDate, toDate, hoursPredicted
    );
    this.taskService.editTask(task).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Powodzenie', detail: 'Pomyślnie edytowano zadanie.' });
        this.ref.close({ success: true });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się edytować zadania.' });
      }
    });
  }

  save(): void {
    if (this.type === 'addProject') {
      this.addProject();
    } else if (this.type === 'editProject') {
      this.editProject();
    } else if (this.type === 'addSubproject') {
      this.addSubproject();
    } else if (this.type === 'editSubproject') {
      this.editSubproject();
    } else if (this.type === 'addTask') {
      this.addTask();
    } else if (this.type === 'editTask') {
      this.editTask();
    }
  }
}
