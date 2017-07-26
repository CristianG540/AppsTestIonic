export class ConfigsService {
  private altBackground: boolean = false;

  public setBackGround(isAlt: boolean) {
    this.altBackground = isAlt;
  }

  public isAltBackground() {
    return this.altBackground;
  }

}