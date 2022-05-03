export class FeatureModel {

  constructor (features,comments) {
    this.features=features;
    this.comments=comments;
  }

  getFeatures = () => this.features;
  getComments = () => this.comments;

  getCommentForFeature=(id)=>this.comments.filter((comment)=>comment.id===id);
}
