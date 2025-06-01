import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { DoctorCommentDto } from 'src/app/models/doctor-comment.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  imports: [CommonModule],
})
export class CommentsComponent implements OnInit {
  readonly comments = input.required<DoctorCommentDto[]>();

  constructor() {}

  ngOnInit() {}
}
