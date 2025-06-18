import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DoctorCommentDto } from 'src/app/models/doctor-comment.model';

interface DoctorCommentGroup {
  doctorAccessId: string;
  doctorName: string;
  comments: DoctorCommentDto[];
}

@Component({
  selector: 'app-doctor-comments',
  templateUrl: './doctor-comments.component.html',
  styleUrls: ['./doctor-comments.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class DoctorCommentsComponent implements OnInit {
  readonly doctorComments = input.required<DoctorCommentDto[]>();

  doctorCommentGroups = computed(() => {
    const comments = this.doctorComments() || [];
    const map: Record<string, DoctorCommentGroup> = {};

    for (const c of comments) {
      if (!map[c.doctorAccessId]) {
        map[c.doctorAccessId] = {
          doctorAccessId: c.doctorAccessId,
          doctorName: c.doctorAccess.name,
          comments: [],
        };
      }
      map[c.doctorAccessId].comments.push(c);
    }

    console.log(comments, map);
    return Object.values(map);
  });

  
  iconForCommentType(typeName: string): string {
    switch (typeName.toLowerCase()) {
      case 'prescription':
        return 'document-text-outline';
      case 'reccomendations':
        return 'medkit-outline';
      default:
        return 'chatbubble-ellipses-outline';
    }
  }

  constructor() {}

  ngOnInit() {}
}
