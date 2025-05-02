import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DocumentGalleryComponent } from "./components/document-gallery/document-gallery.component"

@NgModule({
  imports: [CommonModule, DocumentGalleryComponent],
  exports: [DocumentGalleryComponent],
})
export class SharedComponentsModule {}

