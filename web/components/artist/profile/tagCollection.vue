<style lang="scss" scoped>
small {
  cursor: pointer;
  transition: $transition;
  &:hover {
    transition: $transition;
    color: $layer5;
  }
}
.img-box {
  @extend .horizontal, .middle, .center;
  // max-height: 50px;
  // max-width: 50px;
  overflow: hidden;
  cursor: pointer;
  margin-right: 4 * $space;
  margin-bottom: 4 * $space;
  // background-position: center;
  // background-repeat: no-repeat;
  // background-size: cover;
  box-shadow: $shadow;
  position: relative;
  border-radius: $rounded;
  h6 {
    position: absolute;
    // left: 25%;
    top: 45%;
    z-index: $above;
  }
}

.select {
  @extend .half-width;
  transition: $transition;
}

.tags {
  @extend .horizontal, .center, .middle;
  width: 100%;
  span {
    @extend .horizontal, .center, .middle;
    border-radius: $rounded;
    background: $layer3;
    padding: 2 * $space;
    min-width: 5vw;
    margin-right: 2 * $space;
    cursor: pointer;
    transition: $transition;

    h6 {
      margin-bottom: 0;
      margin-right: 3 * $space;
    }

    &:hover {
      transition: $transition;
      background: $layer1;
      opacity: 0.6;
    }
  }
}

h6 {
  text-transform: capitalize;
}
</style>