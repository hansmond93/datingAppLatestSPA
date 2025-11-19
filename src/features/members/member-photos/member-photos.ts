import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUpload } from "../../../shared/image-upload/image-upload";
import { AccountService } from '../../../core/services/account-service';
import { User } from '../../../types/user';
import { BtnFav } from "../../../shared/btn-fav/btn-fav";
import { BtnDel } from "../../../shared/btn-del/btn-del";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, BtnFav, BtnDel],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);


  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id')

    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        
        this.photos.update(photos => [...photos, photo]) //add new photo to existing photo
        if (!this.memberService.member()?.imageUrl) {
          this.updateUserPhoto(photo);
        }
        
        
      }, 
      error: error => {
        this.loading.set(false);
        console.log(error);
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.updateUserPhoto(photo);
      }
    })
  }

  private updateUserPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser) currentUser.imageUrl = photo.url;
    this.accountService.setCurrentUser(currentUser as User);
    this.memberService.member.update(member => ({
      ...member,
      imageUrl: photo.url
    }) as Member)
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photoId))
      }
    })
  }
 
}
