function Tagpad(props) {
  var views = {
    'add': <Add />,
    'browse': <Browse />
  };
  return (
    <div>
      <Menu page="{props.page}"/>
      {views[props.page]}
    </div>
  );
}
