import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { dataService } from '../_services/data.service'
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/styles';
import DialogDetailComponent from '../DialogDetailComponent'

export const styles = theme => ({
  root: {
    width: '100%',
  },
  table: {
    minWidth: 650,
  },
  tableWrapper: {
    maxHeight: 407,
    overflow: 'auto',
  },
  fab: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: '0 0 0',
    color:'white',
  },
  fabTransparent:{
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: 'transparent',
    boxShadow: '0 0 0',
  }
});



class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage:10,
            confirmDialog: false,
            detailDialog: false,
            listItemDialog: false,
            data:[],
            userSelected: {},
            userDetail: {}
        };
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.confirmDialogEvent.confirm = this.confirmDialogEvent.confirm.bind(this);
        this.confirmDialogEvent.cancel = this.confirmDialogEvent.cancel.bind(this);
        this.detail = this.detail.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.closeListItemDialog = this.closeListItemDialog.bind(this);
        this.customTemplate = this.customTemplate.bind(this);

        this.columns = [
          { id: 'email', label: '������', minWidth: 100 },
          { id: 'name', label: '����', minWidth: 100 },
          {
            id: 'balance',
            label: '�ʹ��ҧ�͹',
            minWidth: 200,
            align: 'left',
          },
          {
            id: 'amount',
            label: '�ӹǹ�Թ���',
            minWidth: 80,
            align: 'left',
          },
          {
            id: 'userId',
            label: 'ʶҹ�',
            minWidth: 120,
            align: 'center',
            special: value => 
              <Fab size="small" onClick={(e) => this.openConfirmDialog(e, value)} variant="extended" aria-label="delete" style={{margin: '10px', backgroundColor: '#648eb5', color: 'white', textTransform: 'inherit', width: '100px'}}>
                �͹�Թ
              </Fab>
          },
        ];
    }

    componentDidMount(){
      this.getUsers()
    }

    getUsers(){
      this.setState(() => ({ data: dataService.getUsers()}));
    }

    handleChangePage(event,newPage){
      this.setState({page: newPage})
    }

    handleChangeRowsPerPage(event) {
      this.setState({page: 0,rowsPerPage:event.target.value})
    }

    confirmDialogEvent = {
      cancel: function () {
        this.setState({ confirmDialog: false });
      },

      confirm: function () {
        this.setState({ confirmDialog: false });
      }
    }

    openConfirmDialog(e, userId) {
      this.setState({userSelected: dataService.getUser(userId)});
      this.setState({confirmDialog: true});
      e.preventDefault();
    }

    closeDialog(){
      this.setState({detailDialog: false});
    }

    closeListItemDialog(){
      this.setState({listItemDialog: false});
    }
    
    closeListItemDialog(){
      this.setState({listItemDialog: false});
    }
    openListItems(e, historyId){
      this.setState({detailDialog: false});
      this.setState({listItemDialog: true});
    }

    customTemplate() {
      const history = dataService.getHistory();
      return (
          <div style={{ width: '500px', borderRadius: '5px', backgroundColor: '#294b81', marginBottom: '10px', color: 'white', padding: '16px' }}>
            <Typography variant="h6" >
            ����觫���
            </Typography>
            <div style={{ paddingBottom: '10px', paddingTop: '10px' }}>
              <Table aria-label="simple table" >
                <TableHead>
                  <TableRow>
                    <TableCell style={{color: 'white'}}>����ѵԡ���͹�Թ</TableCell>
                    <TableCell align="right" style={{color: 'white'}}>�ӹǹ�Թ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map(row => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.historyId} displayBorder={false} onClick={(e) => this.openListItems(e, row.historyId)}>
                      <TableCell style={{color: 'white'}}>{row.date}</TableCell>
                      <TableCell align="right" style={{color: 'white'}}>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        
      )
    }

    customListItemTemplate() {
      const lsItem = dataService.getListItems();
      return (
          <div style={{ width: '500px', borderRadius: '5px', backgroundColor: '#294b81', marginBottom: '10px', color: 'white', padding: '16px' }}>
            <Typography variant="h6" >
            ����觫���
            </Typography>
            <div style={{ paddingBottom: '10px', paddingTop: '10px' }}>
              <Table aria-label="simple table" >
                <TableHead>
                  <TableRow>
                    <TableCell style={{color: 'white'}}>��¡���Թ���</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lsItem.map(row => (
                    <TableRow role="checkbox" tabIndex={-1} key={row.listItemId} displayBorder={false}>
                      <TableCell style={{color: 'white'}}>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        
      )
    }

    detail(e, orderCode){
      if (e.defaultPrevented ) return;
      this.setState({userDetail: dataService.getUserDetail('AA123')});
      this.setState({detailDialog: true});
    }

    confirmDialog() {
      const { userSelected } = this.state;
      const event = this.confirmDialogEvent;
      return (
        <Dialog
          open={this.state.confirmDialog}
          onClose={this.closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"�׹�ѹ����͹�Թ"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ��ͧ����׹�ѹ����͹�Թ�ӹǹ {userSelected.balance} ����� {userSelected.name} �������
          </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'flex-start' }}>
            <Fab size="small" onClick={event.cancel} variant="extended" aria-label="delete" style={{ margin: '10px', backgroundColor: '#eb2a51', color: 'white', textTransform: 'inherit', width: '130px' }}>
              ¡��ԡ
              </Fab>
            <Fab size="small" onClick={event.confirm} variant="extended" aria-label="delete" style={{ margin: '10px', backgroundColor: '#0079ea', color: 'white', textTransform: 'inherit', width: '130px' }}>
              �׹�ѹ
              </Fab>
          </DialogActions>
        </Dialog>
      );
    }

    render() {
        const { classes } = this.props;
        const { page, rowsPerPage, data, detailDialog, userDetail, listItemDialog } = this.state;
        return (
          <>
          
          <Paper className={classes.root}>
          <DialogDetailComponent userDetail={userDetail} customTemplate={this.customTemplate} closeDialog={this.closeDialog} dialogState={detailDialog}/>
          <DialogDetailComponent userDetail={userDetail} customTemplate={this.customListItemTemplate} closeDialog={this.closeListItemDialog} dialogState={listItemDialog}/>
              {this.confirmDialog()}
              <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="flex-start"
                >
                <Fab variant="extended" aria-label="delete" className={classes.fabTransparent} style={{backgroundColor:'transparent',color:'black'}} disabled>
                  PACKAGE
                </Fab>
              </Grid>
            <div className={classes.tableWrapper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {this.columns.map(column => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.userId} onClick={(e) => this.detail(e, row.userId)}>
                        {this.columns.map(column => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align} >
                              {column.format && typeof value === 'number' ? column.format(value)
                                :
                                column.special?
                                  column.special(value)
                                :
                                value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'previous page',
              }}
              nextIconButtonProps={{
                'aria-label': 'next page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Paper>
          </>
        );
    }
}

function mapState(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
}

const connectedPackagePage = connect(mapState,)(withStyles(styles)(UserPage));
export { connectedPackagePage as UserPage };

