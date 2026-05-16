import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="container foter">
                    <div className="row">
                        <div className="col-md">
                            <h4>Developers</h4>
                            <ul>
                                <li>Prashant Chandanshive</li>
                                <li>Aditya Naik</li>
                                <li>Yash Shinde</li>
                                <li>Prithviraj Gurav</li>
                                <li>Vikram Dorugadage</li>
                            </ul>
                        </div>
                        <div className="col-md">
                            <h4>Socials</h4>
                            <ul>
                                <li>
                                    <Link to="/" target="_blank" className="ico"><i className='fab fa-linkedin-in'></i></Link>
                                    <Link to="/" className="ico"><i className="fab fa-instagram"></i></Link>
                                </li>
                                <li>
                                    <Link to="/" target="_blank" className="ico"><i className='fab fa-linkedin-in'></i></Link>
                                    <Link to="/" className="ico"><i className="fab fa-instagram"></i></Link>
                                </li>
                                <li>
                                    <Link to="/" target="_blank" className="ico"><i className='fab fa-linkedin-in'></i></Link>
                                    <Link to="/" className="ico"><i className="fab fa-instagram"></i></Link>
                                </li>
                                <li>
                                    <Link to="/" target="_blank" className="ico"><i className='fab fa-linkedin-in'></i></Link>
                                    <Link to="/" className="ico"><i className="fab fa-instagram"></i></Link>
                                </li>
                                <li>
                                    <Link to="/" target="_blank" className="ico"><i className='fab fa-linkedin-in'></i></Link>
                                    <Link to="/" className="ico"><i className="fab fa-instagram"></i></Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md">
                            <h4>Links & Credits</h4>
                            <ul>
                                <li><Link to="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</Link></li>
                                <li><Link to='https://www.pngwing.com/en/free-png-nbyly' target="_blank">PNGWING</Link></li>
                                <li><Link to='https://www.freepik.com/free-psd/3d-nft-icon-chain_25469859.htm#query=blockchain&position=0&from_view=keyword&track=sph' target="_blank">Image by Graphue on Freepik</Link></li>
                                <li><Link to='https://pngtree.com/' target="_blank">PngTree</Link></li>
                                <li style={{ display: "inline" }}><Link to="https://iconscout.com/icons/box" target="_blank">Cube Icon -</Link><Link to="https://iconscout.com/contributors/unicons" target="_blank">by Unicons Font</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
