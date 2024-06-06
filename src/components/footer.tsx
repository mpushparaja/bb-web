export default function Footer() {
  const styledFooter = {
    width: "100%",
    display: "flex",
    flexDirecion: "row",
    position: "fixed",
    bottom: "0",
    backgroundColor: "#01403c",
    color: "#fff",
    padding: "10px 0",
    alignItems: 'center',
    justifyContent: "center",
  };
  return (
    <div style={styledFooter}>
      <div>
        Bayanihan Bank <a href="mailto:.com">mail@bayanihanbank.com</a>
      </div>
    </div>
  );
}
