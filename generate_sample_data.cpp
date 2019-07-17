#include<bits/stdc++.h>
using namespace std;
#define ll long long
#define pb push_back
#define fr(i,a) for(int i=0;i<a;i++)
#define f first
#define s second
//memset(dp,0,sizeof dp);
int n;
 
void ok()
{
  int N = 76*13+10;
     vector<string>ss;
     for(int i=0;i<N;i++)
    {
        
              string s;
              cin >> s;
              ss.pb(s);
    }
    for(int i=0;i<N;i++)
    {
      for(int j=0;j<N;j++)
      {
        cout<<ss[j]<<" ";
        
      }
      cout<<endl;
    }
   

 
}
int32_t main()
{
 
  int t = 1;
 //cin >> t;
  freopen("output.txt","w",stdout);
  freopen("input.txt","r",stdin);


  while(t--)
  {
      ok();
  }
 
}
