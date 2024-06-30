import Footer from './Footer';
import Header from './Header';

function Layout(props: any) {
  return (
    <div>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}

export default Layout;
