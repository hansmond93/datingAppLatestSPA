import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from "../members/member-card/member-card";
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from "../../shared/paginator/paginator";
import { LikesParams } from '../../types/likeParam';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected likesParams = new LikesParams();

  tabs = [
    {label: 'Liked', value: 'liked'},
    {label: 'Liked me', value: 'likedBy'},
    {label: 'Mutual', value: 'mutual'},
  ]

  ngOnInit(): void {
    const filters = localStorage.getItem('likesFilter');

    if (filters) {
      this.likesParams = JSON.parse(filters);
    }
    this.loadLikes();
  }

  loadLikes() {
    this.likesService.getLikes(this.likesParams).subscribe({
      next: members => this.paginatedMembers.set(members)
    })
  }

  setPredicate(predicate: string) {
    if (this.likesParams.predicate !== predicate) {
      this.likesParams.predicate = predicate;
      this.likesParams.pageNumber = 1;
      this.loadLikes();
    }
    
  }

  onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.likesParams.pageSize = event.pageSize;
    this.likesParams.pageNumber = event.pageNumber;
    this.loadLikes();
  }

}
